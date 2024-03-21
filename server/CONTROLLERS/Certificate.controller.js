const Certificate = require("../MODELS/Certificate.model")

exports.generateCertifcate = async (req, res) => {
    try {
        const { name, courseName, } = req.body

        if (!name || !courseName) {
            return res.status(400).json({
                success: false,
                message: "Unable  to generate certificate without required fields."
            })
        }
        // Checking whether the user already has a certification for this course or not. If yes then it will update else create new one

        let certificateData = await Certificate.findOne({
            name: name,
            courseName: courseName
        })

        if (certificateData) {
            return res.status(200).json({
                success: true,
                message:"Already Created!!",
                certificateData
            })
        }
        else {
            const certificateData = await Certificate.create({
                name,
                courseName
            })

            console.log(certificateData)

            return res.status(200).json({
                success: true,
                certificateData
            })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        })
    }
}

exports.getCertificateDetails = async (req, res) =>{

    try {
        const {id} = req.params
        // console.log(req.params)
        const certificateData = await Certificate.findOne({_id:id})
        if (!certificateData){
            return res.status(404).json({
                success: false,
                message: 'No Certificate Found'
            })
        }
        // console.log(certificateData)
        return res.status(200).json({
            success: true,
            message: "Certificate Details Found",
            certificateData
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        })
    }
}