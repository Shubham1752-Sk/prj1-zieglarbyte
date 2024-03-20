import React, { useState, useEffect } from 'react'
import { PDFDocument, rgb } from 'pdf-lib'
import { QRCodeSVG } from "qrcode.react";
import { useSelector } from 'react-redux';
import { formatDate } from '../../../../UTILS/formatDate';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const Certificate = () => {

    const [loading, setLoading] = useState(true)
    const [certificate, setCertificate] = useState()
    // Create new plugin instance
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    async function loadpdf(name, courseName, dateOfCompletion, id){
        // console.log(id)
        // console.log(name)
        // console.log(courseName)
        // console.log(dateOfCompletion)
        const execBytes = await fetch('/certificate.pdf').then(res => res.arrayBuffer())
        const pdfDoc = await PDFDocument.load(execBytes)
        const firstPage = pdfDoc.getPages()[0]
        const { width, height } = firstPage.getSize()

        let center
        if(name.length > 4 && name.length <10){
            center = width / 2 - width * 10 / 100
        }
        else{
            center = width / 2 - width * 25 / 100
        }

        firstPage.drawText(name, { x: center, y: height / 2 + 115, color: rgb(0.85, 0.7, 0.1), size: 52 })
        firstPage.drawText(courseName, { x: center, y: height / 2 + 25, color: rgb(0.2, 0.5, 0.7), size: 36 })
        firstPage.drawText(formatDate(dateOfCompletion), { x: width / 2 - 70, y: height / 2 - 4, color: rgb(0.2, 0.5, 0.7), size: 12 })
        firstPage.drawText(id, { x: width / 2 - 265, y: 108, color: rgb(0.0, 0.0, 0.0), size: 10 })
        
        const qr = document.getElementById('qr')
        const qr_path = qr.getElementsByTagName('path')[1].getAttribute('d')
        // console.log(qr_path)
        firstPage.drawSvgPath(qr_path, {
            x: width / 2 + 190,
            y: height / 2 - 70,
            scale: 3,
            color: rgb(0, 0, 0)
        })
        const pdfBytes = await pdfDoc.saveAsBase64({ dataUri: true })
        setCertificate(pdfBytes)
        setLoading(false)
        // document.getElementById('pdf').fileUrl = pdfBytes
    }

    const { id, name, courseName, dateOfCompletion } = useSelector((state) => state.certificate)

    loadpdf(name, courseName, dateOfCompletion, id)

    // console.log(certificate)
    
    return (
        <>
            <div className='h-100vh ' style={{ display: 'flex', flexDirection: 'column', justifyContent:'center' }}>
                { !loading && (
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                        <Viewer fileUrl={certificate} className="bg-transparent"
                            plugins={[
                                // Register plugins
                                defaultLayoutPluginInstance,
                            ]}
                        />
                    </Worker> 
                )}
                <iframe title="certificate" id="pdf" style={{ height: "725px",width: "1000px" }}></iframe>
                <QRCodeSVG id="qr"
                    style={
                        { display: 'none' }
                    }
                    value={`http://localhost:3000/verify-certificate/${id}`}
                />
            </div>
        </>
    )
}

export default Certificate