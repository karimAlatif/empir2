const steps = {
    intro: {
        textColor: 0xffffff,
        outlineTextColor: 0x1d3432,
        bgColor: 0x1d3432,
        tintColor: 0xffffff
    },
    step1: {
        name: ['Step 1'],
        textColor: 0xffffff,
        bgColor: 0x1d3432,
        tintColor: 0x1d3432
    },
    step2: {
        name: ['Step 2'],
        textColor: 0xffffff,
        bgColor: 0x253591,
        tintColor: 0x253591
    },
    step3: {
        name: ['Step 3'],
        textColor: 0xffffff,
        bgColor: 0x000000,
        tintColor: 0x000000
    },
    step4: {
        name: ['Step 4'],
        textColor: 0xffffff,
        bgColor: 0x9e9084,
        tintColor: 0x9e9084
    },
    end: {
        textColor: 0xffffff,
        outlineTextColor: 0x000000,
        bgColor: 0x000000,
        tintColor: 0x000000
    }
}
export const main = {
    into : {
        title:[
            `.`,
        ],
        textuers:[
        ],
    },
    end : {
        title:[
            `The modernization of the Ottoman Empire in the 19th`,
            `century started with the military. In 1826 Sultan Mahmud II`,
            `abolished the Janissary corps and established the modern Ottoman army`,
            `He named them as the Nizam-ı Cedid`,
        ],
        textuers:[
            {
                name:"image0.jpg",
                position : {
                    x: 620,
                    y: 50,
                    z: -150,
                },
                scale:{
                    x:650,
                    y:400,
                },
                type:"none"
            },
            {
                name:"image1.jpg",
                position : {
                    x: -400,
                    y: 200,
                    z: -50,
                },
                scale:{
                    x:600,
                    y:400,
                },
                type:"none"

            },
            {
                name:"image2.jpg",
                position : {
                    x: -300,
                    y: -350,
                    z: -500,
                },
                scale:{
                    x:600,
                    y:400,
                },
                type:"none"

            }
        ],
    }
}
export default steps