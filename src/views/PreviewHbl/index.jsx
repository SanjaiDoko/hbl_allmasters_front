import React, { useEffect, useState } from 'react';
import { BlobProvider, PDFViewer, pdf } from '@react-pdf/renderer';
import { createObjectURL } from 'blob-util';
import { HblPdf } from '../../components/HblPdf';
import { useNavigate } from 'react-router';
import './PreviewHbl.css'
import { useDispatch, useSelector } from 'react-redux';
import { resetHblData } from '../../redux/slices/hblSlice';


const PreviewHbl = () => {
  const navigate = useNavigate()
  const [blobUrl, setBlobUrl] = useState(null);
  const dispatch = useDispatch()
  const data = useSelector(state => state.hbl.hblData)

  useEffect(() => {
  
    let payload = {}
   
    const {
      documentNo,
      shipper,
      shipperExportReferences,
      notifyPartyExportReferences,
      consignee,
      destinationAgent,
      pointStateOfOrigin,
      notifyParty,
      ...other
    } = data
    payload.shipper = {
      documentNo,
      shipperName: shipper,
      shipperExportReferences,
    };
    payload.consignee = {
      consigneeName: consignee,
      destinationAgent,
      pointStateOfOrigin,
    };
    payload.notifyParty = {
      notifyPartyName: notifyParty,
      notifyPartyExportReferences,
    };
    payload = { ...payload, ...other };
    payload.prepaidtotal = data.correction.reduce((accumulator, item) => {
      return parseInt(accumulator) + parseInt(item.prepaid ? item.prepaid : 0);
    }, 0);
    payload.collecttotal = data.correction.reduce((accumulator, item) => {
      return parseInt(accumulator) + parseInt(item.collect ? item.collect : 0);
    }, 0);
    payload.correction = data.correction.filter(
      (item) => item.subjectionCorrection && item.prepaid && item.collect
    );
    const generatePdf = async () => {
      const blob = await pdf(HblPdf(payload)).toBlob();
      const url = createObjectURL(blob);
      setBlobUrl(url);
    };

    generatePdf();
  }, []);

  const saveHandler = async(data) => {
    let payload = {}
  
    const {
      documentNo,
      shipper,
      shipperExportReferences,
      notifyPartyExportReferences,
      consignee,
      destinationAgent,
      pointStateOfOrigin,
      notifyParty,
      ...other
    } = data;
    payload.shipper = {
      documentNo,
      shipperName: shipper,
      shipperExportReferences,
    };
    payload.consignee = {
      consigneeName: consignee,
      destinationAgent,
      pointStateOfOrigin,
    };
    payload.notifyParty = {
      notifyPartyName: notifyParty,
      notifyPartyExportReferences,
    };
    payload = { ...payload, ...other };
    payload.correction = data.correction.filter(
      (item) => item.subjectionCorrection && item.prepaid && item.collect
    );
    payload.prepaidtotal = data.correction.reduce((accumulator, item) => {
      return parseInt(accumulator) + parseInt(item.prepaid ? item.prepaid : 0);
    }, 0);
    payload.collecttotal = data.correction.reduce((accumulator, item) => {
      return parseInt(accumulator) + parseInt(item.collect ? item.collect : 0);
    }, 0);

    let apiPayload = {
      data: [payload],
    };
    let response = await fetch("http://localhost:8000/insertHbl", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiPayload),
    });
    let responseData = await response.json();
    if (responseData.status === 1) {
      alert(responseData.response)
      dispatch(resetHblData())
      navigate("/")
    }
  }

  return (
    <div>
      <div className='btn-container'>
        <button className='pbtn' onClick={() => navigate('/')}>Back To Edit</button>
        <button onClick={() => saveHandler(data)} className='pbtn'>Save</button>
      </div>
      {blobUrl && (
        <iframe
          src={blobUrl}
          frameBorder="0"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            width: '80%',
            height: '100%',
            border: 'none',
            marginTop: "130px",
            marginLeft:"150px",
            display: "flex",
            justifyContent: "center",
            alignItems:"center",
            padding: 0,
            // overflow: 'hidden',
            zIndex: 999999,
          }}
        />
      )}
    </div>
  );
};

export default PreviewHbl;
