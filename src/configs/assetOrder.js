
import {Positions, TextureTypeEnum } from './config'

const assetOrder = {
    "step1": [
        {name:"video0.mp4",position : Positions.middle, type: TextureTypeEnum.roadBlock}
    ],
    "step2": [
        {name:"empty0.png",position : Positions.bottomLeft, type: TextureTypeEnum.standard},
        {name:"image0.jpg",position : Positions.topRight, type: TextureTypeEnum.standard},
        {name:"image1.jpg",position : Positions.middleLeft, type: TextureTypeEnum.standard},
        {name:"image2.jpg",position : Positions.middleRight, type: TextureTypeEnum.standard},
        {name:"image3.jpg",position : Positions.middleLeft, type: TextureTypeEnum.standard},
        {name:"image4.jpg",position : Positions.topRight, type: TextureTypeEnum.standard},
        {name:"empty1.png",position : Positions.bottomLeft, type: TextureTypeEnum.standard},
        {name:"video5.mp4",position : Positions.middle, type: TextureTypeEnum.roadBlock}
    ],
    "step3": [
        {name:"empty0.png",position : Positions.bottomLeft, type: TextureTypeEnum.standard},
        {name:"empty1.png",position : Positions.bottomLeft, type: TextureTypeEnum.standard},
        {name:"empty2.png",position : Positions.bottomLeft, type: TextureTypeEnum.animatedNumber},
        // {name:"empty2.png",position : Positions.bottomLeft, type: TextureTypeEnum.standard},//
        {name:"empty3.png",position : Positions.bottomLeft, type: TextureTypeEnum.standard},
        {name:"video4.mp4",position : Positions.topRight, type: TextureTypeEnum.video},
        {name:"video5.mp4",position : Positions.bottomLeft, type: TextureTypeEnum.video},
        {name:"video6.mp4",position : Positions.middle, type: TextureTypeEnum.roadBlock}
    ],
    "step4": [
        {name:"empty0.png",position : Positions.bottomLeft, type: TextureTypeEnum.standard},
        {name:"image1.jpg",position : Positions.topRight, type: TextureTypeEnum.standard},
        {name:"image2.jpg",position : Positions.middleLeft, type: TextureTypeEnum.standard},
        {name:"image3.jpg",position : Positions.middleRight, type: TextureTypeEnum.standard},
    ]
};
export default assetOrder;