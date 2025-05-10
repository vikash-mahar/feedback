import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createTweet = asyncHandler( async(req,res)=>{
    const {content} = req.body

    if(!content.trim()){
        throw new ApiError(400,"connent must required for tweet")
    }

    const tweet = await Tweet.create({
        content: content,
        owner: req.user?._id
    })

    if(!tweet){
        throw new ApiError(500,"error while creating tweet")
    }

    return res.status(200)
    .json(new ApiResponse(200,tweet,"tweet created successfully"))
})

const getAllTweets = asyncHandler(async(req,res)=>{
    const {page=1,limit=30} = req.query

    const tweets = await Tweet.aggregate([
        {
            $sort:{
                createdAt:-1
            }
        },
        {
            $skip:(page-1)*limit
        },
        {
            $limit:parseInt(limit)
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        }, 
        // {
        //     $unwind: {
        //         path: "$owner",
        //     }
        // },
        
        {
            $addFields:{
                owner:{
                    $first:"$owner"
                }
            }
        },
        {
            $lookup:{
                from:"likes",
                localField:"_id",
                foreignField:"tweet",
                as:"likes"
            }
        },
        {
            $addFields:{
                likesCount:{
                    $size:"$likes"
                },
                isliked:{
                    cond:{
                        if:{$in:[req.user?._id,"$likes.likedBy"]},
                        then:true,
                        else:false
                    }
                }
            }
        },
        {
            $project:{
                _id:1,
                owner:1,
                content:1,
                isliked:1,
                likesCount:1,
                createdAt:1,
                updatedAt:1
            }
        }
    ])

    if(!tweets){
        throw new ApiError(402,"error while fetching tweets")
    }

    return res.status(200)
    .json(new ApiResponse(200,tweets,"tweets fetched successsfullt"))
})

export {
    createTweet,
    getAllTweets,

}