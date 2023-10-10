import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import "./Hbl.css";
import * as yup from "yup";
import { BlobProvider, PDFViewer, pdf } from "@react-pdf/renderer";
import { HblPdf } from "../../components/HblPdf";
import { createObjectURL } from "blob-util";
import moment from "moment";
import { FormInput } from "../../components/Input/input";
import { TextArea } from "../../components/TextArea";
import Form from "react-bootstrap/Form";
import DeleteIcon from "@mui/icons-material/Delete";
import { validationSchema } from "../../validationSchema/hblValidation";
import { useDispatch, useSelector } from "react-redux";
import { resetHblData, setHblData } from "../../redux/slices/hblSlice";
import { useNavigate } from "react-router";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from 'dayjs';

const openFileNewWindow = async (data) => {
  let blob = await pdf(HblPdf(data)).toBlob();
  let blobUrl;
  // if (typeof fileData !== "string") {
  // 	throw new Error("Uploaded File is Not a String");
  // }
  /* convert base64 string to blob object */
  // blob = base64StringToBlob(
  // 	fileData.substring(fileData.indexOf(",") + 1),
  // 	"application/pdf"
  // );
  /* convert blob to blobUrl */
  blobUrl = createObjectURL(blob);
  const userAgent = window.navigator.userAgent;

  if (userAgent.includes("Windows")) {
    const win = window.open();
    win.document.write(
      '<iframe src="' +
        blobUrl +
        '" frameborder="0" style="position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;" allowfullscreen></iframe>'
    );
  } else {
    window.open(blobUrl, "width=100%,height=100%,top=0,left=0,fullscreen=yes");
  }
};

let defaultCorrection = [
  {
    subjectionCorrection: "",
    prepaid: "",
    collect: "",
  },
  {
    subjectionCorrection: "",
    prepaid: "",
    collect: "",
  },
  {
    subjectionCorrection: "",
    prepaid: "",
    collect: "",
  },
  {
    subjectionCorrection: "",
    prepaid: "",
    collect: "",
  },
  {
    subjectionCorrection: "",
    prepaid: "",
    collect: "",
  },
  {
    subjectionCorrection: "",
    prepaid: "",
    collect: "",
  },
  {
    subjectionCorrection: "",
    prepaid: "",
    collect: "",
  },
];

const Hbl = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector((state) => state.hbl.hblData);
  const [shipmentType, setShipmentType] = useState("fcl");
  // const [reset,setReset] = useState(false)
  const [marksType, setMarksType] = useState(data.marksType ? data.marksType : "multi");
  let initialCargoItems = {
    containerText: "",
    containerType: "",
    cargoText: "",
    cargoType: "",
    marksAndNumbers: "",
    description: "",
    grossWeight: "",
    measurement: "",
  };
  const {
    control,
    watch,
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors, defaultValues },
    reset,
    clearErrors,
  } = useForm({
    resolver: yupResolver(validationSchema),
    context: { shipmentType: shipmentType, marksType },
    defaultValues: {
      shipper: "",
      consignee: "",
      notifyParty: "",
      notifyPartyExportReferences: "",
      documentNo: "",
      shipperExportReferences: "",
      destinationAgent: "",
      pointStateOfOrigin: "",
      preCarriageBy: "",
      placeOfReceiptByPreCarrier: "",
      oceanCarrier: "",
      source: "",
      contractReference: "",
      exportVessel: "",
      portOfLoading: "",
      loadingPier: "",
      portOfDischarge: "",
      placeOfDelivery: "",
      typeOfMove: "PortToPort",
      shipmentType: "fcl",
      cargoItems: [
        {
          containerText: "",
          containerType: "",
          cargoText: "",
          cargoType: "",
          marksAndNumbers: "",
          description: "",
          grossWeight: "",
          measurement: "",
        },
      ],
      marksType: "multi",
      declaredValue: "",
      issuedAt: "Dubai",
      issuedCountry: "UNITED ARAB EMIRATES",
      issuedBy: "Al Barrak Shipping Agencies Co. LLC.",
      blDate: null,
      correction: [
        {
          subjectionCorrection: "",
          prepaid: "",
          collect: "",
        },
        {
          subjectionCorrection: "",
          prepaid: "",
          collect: "",
        },
        {
          subjectionCorrection: "",
          prepaid: "",
          collect: "",
        },
        {
          subjectionCorrection: "",
          prepaid: "",
          collect: "",
        },
        {
          subjectionCorrection: "",
          prepaid: "",
          collect: "",
        },
        {
          subjectionCorrection: "",
          prepaid: "",
          collect: "",
        },
        {
          subjectionCorrection: "",
          prepaid: "",
          collect: "",
        },
      ],
    },
    mode: "onSubmit",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "cargoItems",
  });

  useEffect(() => {
    console.log("ren der")
    if (data.documentNo) {
      console.log(data,"data")
      let formData = { ...data };
      formData.correction = defaultCorrection;
      formData.blDate = dayjs(formData.blDate,"YYYY-DD-MM")
      reset(formData);
    }
  }, []);

  const { fields: cargoFields } = useFieldArray({
    control,
    name: "correction",
  });

  const onChangeShipment = (value) => {
    setShipmentType(value);
    if (value === "lcl") {
      setValue(
        "cargoItems",
        getValues("cargoItems").map((objec, i) => {
          clearErrors(`cargoItems[${i}].containerText`);
          clearErrors(`cargoItems[${i}].containerType`);
          return { ...objec, containerText: "", containerType: "" };
        })
      );
    } else {
      getValues("cargoItems").map((objec, i) => {
        clearErrors(`cargoItems[${i}].cargoText`);
        clearErrors(`cargoItems[${i}].cargoType`);
      });
    }
  };

  const MarksChangeHandler = (value) => {
    setMarksType(value);
    if (value === "single") {
      console.log(getValues(),"values")
      setValue(
        "cargoItems",
        getValues("cargoItems").map((objec, i) => {
          if (i === 0) {
            return { ...objec};
          } else {
            clearErrors(`cargoItems[${i}].marksAndNumbers`);
            return { ...objec, marksAndNumbers: "" };
          }
        })
      );
    } else {
    }
  };

  const resetHandler = () => {
    reset(defaultValues);
    alert("Are you sure you want to reset the values");
    dispatch(resetHblData());
    window.location.reload()

  };

  const formSubmitHandler = async (data) => {
    dispatch(setHblData(data));
    navigate("/preview");
  };

  const addCargoItem = () => {
    append(initialCargoItems);
  };

  const CargoItem = React.memo(({ index }) => {
    return (
      <div className="cargoItemContainer">
        {
          <div
            className={`marksdiv ${
              index != 0 && watch("marksType") === "single" ? "hidden" : ""
            }`}
          >
            <TextArea
              formProps={{
                control,
                name: `cargoItems.${index}.marksAndNumbers`,
              }}
              row="3"
              cols="59"
              className="ctext"
              parentClassName="ctextdiv"
            />
          </div>
        }
        <div className="packagesdiv">
          <div className="col-flex">
            <input
              {...register(`cargoItems.${index}.containerText`)}
              disabled={watch("shipmentType") === "lcl"}
              type="text"
              className="field_r"
            />
            <Form.Text className="error">
              {errors?.cargoItems
                ? errors.cargoItems[index]?.containerText
                  ? errors.cargoItems[index]?.containerText.message
                  : ""
                : ""}
            </Form.Text>
            <Controller
              name={`cargoItems.${index}.containerType`}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <>
                  <select
                    {...field}
                    disabled={watch("shipmentType") === "lcl"}
                    name="containerType"
                    id="containerType"
                    className="fields_r seconddivselect rselect"
                  >
                    <option value=""></option>
                    <option value="10G1">
                      10 Foot Dry (10' x 8' x 8') - 10G1
                    </option>
                    <option value="2000">20' DV</option>
                    <option value="20B0">
                      20 Foot Bulk (20' x 8' x 8') - 20B0
                    </option>
                    <option value="20B1">
                      20 Foot Bulk (20' x 8' x 8') - 20B1
                    </option>
                    <option value="20B3">
                      20 Foot Bulk (20' x 8' x 8') - 20B3
                    </option>
                    <option value="20B4">
                      20 Foot Bulk (20' x 8' x 8') - 20B4
                    </option>
                    <option value="20B5">
                      20 Foot Bulk (20' x 8' x 8') - 20B5
                    </option>
                    <option value="20B6">
                      20 Foot Bulk (20' x 8' x 8') - 20B6
                    </option>
                    <option value="20FR">20 Foot Flat Rack - 20FR</option>
                    <option value="20G0">
                      20 Foot Dry (20' x 8' x 8') - 20G0
                    </option>
                    <option value="20G1">
                      20 Foot Dry (20' x 8' x 8') - 20G1
                    </option>
                    <option value="20G2">
                      20 Foot Dry (20' x 8' x 8') - 20G2
                    </option>
                    <option value="20G3">
                      20 Foot Dry (20' x 8' x 8') - 20G3
                    </option>
                    <option value="20H0">
                      20 Foot Insulated (20' x 8' x 8') - 20H0
                    </option>
                    <option value="20H1">
                      20 Foot Insulated (20' x 8' x 8') - 20H1
                    </option>
                    <option value="20H2">
                      20 Foot Insulated (20' x 8' x 8') - 20H2
                    </option>
                    <option value="20H5">
                      20 Foot Insulated (20' x 8' x 8') - 20H5
                    </option>
                    <option value="20H6">
                      20 Foot Insulated (20' x 8' x 8') - 20H6
                    </option>
                    <option value="20P1">
                      20 Foot Flat (20' x 8' x 8') - 20P1 (O)
                    </option>
                    <option value="20P2">
                      20 Foot Flat (20' x 8' x 8') - 20P2 (O)
                    </option>
                    <option value="20P3">
                      20 Foot Flat Collapsible (20' x 8' x 8') - 20P3 (O)
                    </option>
                    <option value="20P4">
                      20 Foot Flat Collapsible (20' x 8' x 8') - 20P4 (O)
                    </option>
                    <option value="20P5">
                      20 Foot Platform Superstructure (20' x 8' x 8') - (O)
                    </option>
                    <option value="20R0">
                      20 Foot Reefer (20' x 8' x 8') - 20R0 (R)
                    </option>
                    <option value="20R1">
                      20 Foot Reefer (20' x 8' x 8') - 20R1 (R)
                    </option>
                    <option value="20R2">
                      20 Foot Reefer (20' x 8' x 8') - 20R2 (R)
                    </option>
                    <option value="20R3">
                      20 Foot Reefer (20' x 8' x 8') - 20R3 (R)
                    </option>
                    <option value="20R8">
                      20 Foot Reefer (20' x 8' x 8') - 20R8 (R)
                    </option>
                    <option value="20R9">
                      20 Foot Reefer (20' x 8' x 8') - 20R9 (R)
                    </option>
                    <option value="20T0">
                      20 Foot Tank (20' x 8' x 8') - 20T0
                    </option>
                    <option value="20T1">
                      20 Foot Tank (20' x 8' x 8') - 20T1
                    </option>
                    <option value="20T2">
                      20 Foot Tank (20' x 8' x 8') - 20T2
                    </option>
                    <option value="20T3">
                      20 Foot Tank for Dangerous Liquid (20' x 8' x 8'){" "}
                    </option>
                    <option value="20T4">
                      20 Foot Tank for Dangerous Liquid (20' x 8' x 8'){" "}
                    </option>
                    <option value="20T5">
                      20 Foot Tank for Dangerous Liquid (20' x 8' x 8'){" "}
                    </option>
                    <option value="20T6">
                      20 Foot Tank for Dangerous Liquid (20' x 8' x 8'){" "}
                    </option>
                    <option value="20T7">
                      20 Foot Tank for Gas (20' x 8' x 8') - 20T7
                    </option>
                    <option value="20T8">
                      20 Foot Tank for Gas (20' x 8' x 8') - 20T8
                    </option>
                    <option value="20T9">
                      20 Foot Tank for Gas (20' x 8' x 8') - 20T9
                    </option>
                    <option value="20U0">
                      20 Foot Open Top (20' x 8' x 8') - 20U0 (O)
                    </option>
                    <option value="20U1">
                      20 Foot Open Top (20' x 8' x 8') - 20U1 (O)
                    </option>
                    <option value="20U2">
                      20 Foot Open Top (20' x 8' x 8') - 20U2 (O)
                    </option>
                    <option value="20U3">
                      20 Foot Open Top (20' x 8' x 8') - 20U3 (O)
                    </option>
                    <option value="20U4">
                      20 Foot Open Top (20' x 8' x 8') - 20U4 (O)
                    </option>
                    <option value="20U5">
                      20 Foot Open Top (20' x 8' x 8') - 20U5 (O)
                    </option>
                    <option value="20V0">
                      20 Foot Ventilated (20' x 8' x 8') - 20V0
                    </option>
                    <option value="20V2">
                      20 Foot Ventilated (20' x 8' x 8') - 20V2
                    </option>
                    <option value="20V4">
                      20 Foot Ventilated (20' x 8' x 8') - 20V4
                    </option>
                    <option value="22B0">20' Bulk</option>
                    <option value="22B1">
                      20 Foot Bulk (20' x 8'6'' x 8') - 22B1
                    </option>
                    <option value="22B3">
                      20 Foot Bulk (20' x 8'6'' x 8') - 22B3
                    </option>
                    <option value="22B4">
                      20 Foot Bulk (20' x 8'6'' x 8') - 22B4
                    </option>
                    <option value="22B5">
                      20 Foot Bulk (20' x 8'6'' x 8') - 22B5
                    </option>
                    <option value="22B6">
                      20 Foot Bulk (20' x 8'6'' x 8') - 22B6
                    </option>
                    <option value="22G0">20' Standard Dry</option>
                    <option value="22G1">20' SD</option>
                    <option value="22G2">20' Dry - 22G2</option>
                    <option value="22G3">20' Dry - 22G3</option>
                    <option value="22G4">20' GP</option>
                    <option value="22G8">20' General Purpose Dry</option>
                    <option value="22G9">20' General Purpose</option>
                    <option value="22H0">20' Reefer/Insulated (R)</option>
                    <option value="22H2">20' RF/Insulated (R)</option>
                    <option value="22P1">20' Flat (O)</option>
                    <option value="22P2">
                      20 Foot Flat (20' x 8'6'' x 8') - 22P2 (O)
                    </option>
                    <option value="22P3">20' Flat Collapsible (O)</option>
                    <option value="22P5">
                      20' Platform Superstructure (O)
                    </option>
                    <option value="22P7">20' Platform (O)</option>
                    <option value="22P8">
                      20 Foot Platform (20' x 8'6'' x 8') - 22P8 (O)
                    </option>
                    <option value="22P9">
                      20 Foot Platform (20' x 8'6'' x 8') - 22P9 (O)
                    </option>
                    <option value="22R0">20' Reefer/ Mechanical (R)</option>
                    <option value="22R1">20' Reefer/ Mechanical (R)</option>
                    <option value="22R7">20' Reefer (R)</option>
                    <option value="22R9">20' RF (R)</option>
                    <option value="22S1">20' Automobile</option>
                    <option value="22T0">20' Tank</option>
                    <option value="22T1">
                      20 Foot Tank (20' x 8'6'' x 8') - 22T1
                    </option>
                    <option value="22T2">
                      20 Foot Tank (20' x 8'6'' x 8') - 22T2
                    </option>
                    <option value="22T3">
                      20 Foot Tank for Dangerous Liquid (20' x 8'6'' x 8
                    </option>
                    <option value="22T4">
                      20 Foot Tank for Dangerous Liquid (20' x 8'6'' x 8
                    </option>
                    <option value="22T5">
                      20 Foot Tank for Dangerous Liquid (20' x 8'6'' x 8
                    </option>
                    <option value="22T6">
                      20 Foot Tank for Dangerous Liquid (20' x 8'6'' x 8
                    </option>
                    <option value="22T7">
                      20 Foot Tank for Gas (20' x 8'6'' x 8') - 22T7
                    </option>
                    <option value="22T8">
                      20 Foot Tank for Gas (20' x 8'6'' x 8') - 22T8
                    </option>
                    <option value="22U0">20' Open Top (O)</option>
                    <option value="22U1">20' OT (O)</option>
                    <option value="22U6">20' Hard Top</option>
                    <option value="22UP">20 Hard Top - 22UP</option>
                    <option value="22V0">20' GP / Ventilated</option>
                    <option value="22V2">20' DV / Mechanical</option>
                    <option value="22V3">20' Dry Ventilated</option>
                    <option value="22VH">20 Ventilated</option>
                    <option value="25G0">20' High Cube Dry</option>
                    <option value="25R1">20' High Cube Reefer</option>
                    <option value="26G0">20' HC Dry</option>
                    <option value="26H0">20' High Cube Reefer/Insulated</option>
                    <option value="26T0">20' High Cube Tank</option>
                    <option value="28P0">
                      20 Foot Platform (20' x 4'3'' x 8') - 28P0 (O)
                    </option>
                    <option value="28T8">
                      20 Foot Tank for Gas (20' x 4'3'' x 8') - 28T8
                    </option>
                    <option value="28U1">
                      20 Foot Open Top (20' x 4'3'' x 8') - 28U1 (O)
                    </option>
                    <option value="28V0">
                      20 Foot Ventilated (20' x 4'3'' x 8') - 28V0
                    </option>
                    <option value="29P0">
                      20 Foot Platform (20' x 4' x 8') - 29P0 (O)
                    </option>
                    <option value="2EG0">
                      20 Foot High Cube Dry (20' x 9'6'' x 8'/8'2'') - 2
                    </option>
                    <option value="4000">40' DV</option>
                    <option value="42B0">40' Bulk</option>
                    <option value="42FR">40 Foot Flat Rack - 42FR</option>
                    <option value="42G0">40' GP</option>
                    <option value="42G1">40' Standard Dry</option>
                    <option value="42H0">40' Reefer/Insulated (R)</option>
                    <option value="42P1">40' Flat (O)</option>
                    <option value="42P2">
                      40 Foot Flat (40' x 8'6'' x 8') - 42P2 (O)
                    </option>
                    <option value="42P3">40' Flat Collapsible (O)</option>
                    <option value="42P5">
                      40' Platform Superstructure (O)
                    </option>
                    <option value="42P6">40' Platform (O)</option>
                    <option value="42P8">
                      40 Foot Platform (40' x 8'6'' x 8') - 42P8 (O)
                    </option>
                    <option value="42P9">
                      40 Foot Platform (40' x 8'6'' x 8') - 42P9 (O)
                    </option>
                    <option value="42R0">40' Reefer/ Mechanical (R)</option>
                    <option value="42R1">40' Reefer/ Mechanical (R)</option>
                    <option value="42R3">40' RF (R)</option>
                    <option value="42R9">40' Reefer (R)</option>
                    <option value="42S1">40' Automobile</option>
                    <option value="42T0">40' Tank</option>
                    <option value="42T2">
                      40 Foot Tank (40' x 8'6'' x 8') - 42T2
                    </option>
                    <option value="42T5">
                      40 Foot Tank for Dangerous Liquid (40' x 8'6'' x 8
                    </option>
                    <option value="42T6">
                      40 Foot Tank for Dangerous Liquid (40' x 8'6'' x 8
                    </option>
                    <option value="42T8">
                      40 Foot Tank for Gas (40' x 8'6'' x 8') - 42T8
                    </option>
                    <option value="42U1">40' Open Top (O)</option>
                    <option value="42U6">40' Hard Top</option>
                    <option value="42UP">40 Hard Top</option>
                    <option value="42V0">40' Dry Ventilated</option>
                    <option value="42VH">40 Ventilated</option>
                    <option value="45B3">40' High Cube Bulk</option>
                    <option value="45G0">40' High Cube Dry</option>
                    <option value="45G1">40' HC Dry</option>
                    <option value="45P3">40' High Cube Flat (O)</option>
                    <option value="45P8">40' High Cube Platform (O)</option>
                    <option value="45R1">40' HC Reefer (R)</option>
                    <option value="45R9">40' High Cube Reefer (R)</option>
                    <option value="45U1">40' High Cube Open Top (O)</option>
                    <option value="45U6">40' High Cube Hardtop</option>
                    <option value="46H0">
                      40' High Cube Reefer/Insulated (R)
                    </option>
                    <option value="46P3">
                      40' High Cube Flat Collapsible (O)
                    </option>
                    <option value="48P0">
                      40 Foot Platform (40' x 4'3'' x 8') - 48P0 (O)
                    </option>
                    <option value="48T8">
                      40 Foot Tank for Gas (40' x 4'3'' x 8') - 48T8
                    </option>
                    <option value="48U1">
                      40 Foot Open Top (40' x 4'3'' x 8') - 48U1 (O)
                    </option>
                    <option value="49P0">
                      40 Foot Platform (40' x 4' x 8') - 49P0 (O)
                    </option>
                    <option value="4CG0">
                      40 Foot Dry (40' x 8'6'' x 8'/8'2'') - 4CG0
                    </option>
                    <option value="CONT">CONTAINERS</option>
                    <option value="L0G1">
                      45 Foot Dry (45' x 8' x 8') - L0G1
                    </option>
                    <option value="L2G1">45' Dry</option>
                    <option value="L2P1">45' Platform</option>
                    <option value="L2R1">45' Reefer/Mechanical (R)</option>
                    <option value="L2T0">45' Tank</option>
                    <option value="L2U1">45' Open Top (O)</option>
                    <option value="L5G0">45' High Cube Dry</option>
                    <option value="L5G1">45' High Cube Dry </option>
                    <option value="L5R0">45' High Cube Reefer (R)</option>
                    <option value="L5R1">45' HC Reefer / Mechanical (R)</option>
                    <option value="L5R2">45' HCRF (R)</option>
                    <option value="L5R3">45' HC Reefer (R)</option>
                    <option value="L5R4">45' High Cube Reefer (R)</option>
                    <option value="L5R8">
                      45 Foot High Cube Reefer (45' x 9'6'' x 8') - L5R8 (R)
                    </option>
                    <option value="L5R9">
                      45 Foot High Cube Reefer (45' x 9'6'' x 8') - L5R9 (R)
                    </option>
                    <option value="LDG1">
                      45 Foot High Cube Dry (45' x 9' x 8'/8'2'') - LDG1
                    </option>
                    <option value="LDG8">
                      45 Foot High Cube General Purpose / Dry (45' x 9'{" "}
                    </option>
                    <option value="LEG1">
                      45 Foot High Cube Dry (45' x 9'6'' x 8'/8'2'') - L
                    </option>
                    <option value="LEG8">
                      45 Foot High Cube General Purpose / Dry (45' x 9'6
                    </option>
                    <option value="LEG9">
                      45 Foot High Cube General Purpose / Dry (45' x 9'6
                    </option>
                    <option value="LLG1">
                      45 Foot Dry (45' x 8'6'' x &gt;8'2'') - LLG1
                    </option>
                    <option value="LNG1">
                      45 Foot High Cube Dry (45' x 9'6'' x &gt;8'2'') - LNG
                    </option>
                    <option value="LNR1">
                      45 Foot High Cube Reefer (45' x 9'6'' x &gt;8'2'') - (R)
                    </option>
                    <option value="M5G0">48 Foot High Cube - M5G0</option>
                    <option value="P5G0">53 Foot High Cube - P5G0</option>
                  </select>
                  <Form.Text className="error">
                    {errors?.cargoItems
                      ? errors.cargoItems[index]?.containerType
                        ? errors.cargoItems[index]?.containerType.message
                        : ""
                      : ""}
                  </Form.Text>
                </>
              )}
            />
          </div>
          <div className="col-flex">
            <input
              {...register(`cargoItems.${index}.cargoText`)}
              type="text"
              className="field_b"
            />
            <Form.Text className="error">
              {errors?.cargoItems
                ? errors.cargoItems[index]?.cargoText
                  ? errors.cargoItems[index]?.cargoText.message
                  : ""
                : ""}
            </Form.Text>
            <Controller
              name={`cargoItems.${index}.cargoType`}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <select
                  {...field}
                  name="cargoType"
                  id="cargoType"
                  className="fields_b seconddivselect bselect"
                >
                  <option value=""></option>
                  <option value="AMM">AMMO PACK</option>
                  <option value="ATH">ATTACHMENT</option>
                  <option value="BAG">BAG</option>
                  <option value="BLE">BALE</option>
                  <option value="BDG">BANDING</option>
                  <option value="BRG">BARGE</option>
                  <option value="BBL">BARREL</option>
                  <option value="BSK">BASKET OR HAMPER</option>
                  <option value="BEM">BEAM</option>
                  <option value="BLT">BELTING</option>
                  <option value="BIB">BIG BAG</option>
                  <option value="BIN">BIN</option>
                  <option value="BIC">BING CHEST</option>
                  <option value="BLO">BLOCK</option>
                  <option value="BOB">BOBBIN</option>
                  <option value="BOT">BOTTLE</option>
                  <option value="BOX">BOX</option>
                  <option value="BXI">BOX, WITH INNER CONTAINER</option>
                  <option value="BRC">BRACING</option>
                  <option value="BXT">BUCKET</option>
                  <option value="BLK">BULK</option>
                  <option value="BKG">BULK BAG</option>
                  <option value="BDL">BUNDLE</option>
                  <option value="CAB">CABINET</option>
                  <option value="CAG">CAGE</option>
                  <option value="CAN">CAN</option>
                  <option value="CCS">CAN CASE</option>
                  <option value="CNC">CAN, CYLINDRICAL</option>
                  <option value="CNR">CAN, RECTANGULAR</option>
                  <option value="CLD">CAR LOAD, RAIL</option>
                  <option value="CBY">CARBOY</option>
                  <option value="CBN">CARBOY, NON-PROTECTED</option>
                  <option value="CBP">CARBOY, PROTECTED</option>
                  <option value="CAR">CARRIER</option>
                  <option value="CTN">CARTON</option>
                  <option value="CAS">CASE</option>
                  <option value="CSK">CASK</option>
                  <option value="CHE">CHEESES</option>
                  <option value="CHS">CHEST</option>
                  <option value="COL">COIL</option>
                  <option value="CLI">COLLI</option>
                  <option value="CON">CONE</option>
                  <option value="COR">CORE</option>
                  <option value="CRF">CORNER REINFORCEMENT</option>
                  <option value="CRD">CRADLE</option>
                  <option value="CRT">CRATE</option>
                  <option value="CUB">CUBE</option>
                  <option value="CYN">CYLINDER</option>
                  <option value="CYL">CYLINDER</option>
                  <option value="DRK">DOUBLE-LENGTH RACK</option>
                  <option value="DTB">DOUBLE-LENGTH TOTE BIN</option>
                  <option value="DRM">DRUM</option>
                  <option value="DBK">DRY BULK</option>
                  <option value="EPR">EDGE PROTECTION</option>
                  <option value="EGG">EGG CRATING</option>
                  <option value="ENV">ENVELOPE</option>
                  <option value="FIR">FIRKIN</option>
                  <option value="FSK">FLASK</option>
                  <option value="FXB">FLEXIBAG</option>
                  <option value="FLO">FLO-BIN</option>
                  <option value="FWR">FORWARD REEL</option>
                  <option value="FRM">FRAME</option>
                  <option value="GAL">GALLON</option>
                  <option value="HRK">HALF-STANDARD RACK</option>
                  <option value="HTB">HALF-STANDARD TOTE BIN</option>
                  <option value="HED">HEADS OF BEEF</option>
                  <option value="HGH">HOGSHEAD</option>
                  <option value="HPT">HOPPER TRUCK</option>
                  <option value="ITM">ITEM</option>
                  <option value="JAR">JAR</option>
                  <option value="JUG">JUG</option>
                  <option value="JBG">JUMBO BAG</option>
                  <option value="KEG">KEG</option>
                  <option value="KIT">KIT</option>
                  <option value="KRK">KNOCKDOWN RACK</option>
                  <option value="KTB">KNOCKDOWN TOTE BIN</option>
                  <option value="LIF">LIFT</option>
                  <option value="LVN">LIFT VAN</option>
                  <option value="LNR">LINER</option>
                  <option value="LID">LIP/TOP</option>
                  <option value="LBK">LIQUID BULK</option>
                  <option value="LOG">LOG</option>
                  <option value="LSE">LOOSE</option>
                  <option value="LUG">LUG</option>
                  <option value="MET">METAL PACKAGES</option>
                  <option value="MIX">MIXED CONTAINER TYPES</option>
                  <option value="MXD">MIXED TYPE PACK</option>
                  <option value="MRP">MULTI-ROLL PACK</option>
                  <option value="NOL">NOIL</option>
                  <option value="HRB">ON HANGER OR RACK IN BOX</option>
                  <option value="WHE">ON OWN WHEEL</option>
                  <option value="OVW">OVERWRAP</option>
                  <option value="PCK">PACK-NOT OTHERWISE SPECIFIED</option>
                  <option value="PKG">PACKAGE</option>
                  <option value="PAL">PAIL</option>
                  <option value="PLT">PALLET</option>
                  <option value="PCL">PARCEL</option>
                  <option value="PRT">PARTITIONING</option>
                  <option value="PCS">PIECE</option>
                  <option value="PIR">PIMS</option>
                  <option value="PRK">PIPE RACK</option>
                  <option value="PLN">PIPELINE</option>
                  <option value="PLF">PLATFORM</option>
                  <option value="PLC">PRIMARY LIFT CONTAINER</option>
                  <option value="POV">PRIVATE VEHICLE</option>
                  <option value="QTR">QUARTER OF BEEF</option>
                  <option value="RCK">RACK</option>
                  <option value="RAL">RAIL (SEMICONDUCTOR)</option>
                  <option value="REL">REEL</option>
                  <option value="RFT">REINFORCEMENT</option>
                  <option value="RVR">REVERSE REEL</option>
                  <option value="ROL">ROLL</option>
                  <option value="SAK">SACK</option>
                  <option value="SVN">SEAVAN - SEA VAN</option>
                  <option value="SPR">SEPERATOR\DIVIDER</option>
                  <option value="SET">SET</option>
                  <option value="SHT">SHEET</option>
                  <option value="SHK">SHOOK</option>
                  <option value="SHW">SHRINK WRAPPED</option>
                  <option value="SID">SIDE OF BEEF</option>
                  <option value="SKD">SKID</option>
                  <option value="SKE">SKID, ELEVATING OF LIFT TRUCK</option>
                  <option value="SLV">SLEEVE</option>
                  <option value="SLP">SLIP SHEET</option>
                  <option value="SB">SMALL BAG</option>
                  <option value="DSK">SOUBLE-LENGTH SKID</option>
                  <option value="SPI">SPIN CYLINDER</option>
                  <option value="SPL">SPOOL</option>
                  <option value="TNK">TANK</option>
                  <option value="TKR">TANK CAR</option>
                  <option value="TKT">TANK TRUCK</option>
                  <option value="TRC">TIERCE</option>
                  <option value="TIN">TIN</option>
                  <option value="TBN">TOTE BIN</option>
                  <option value="TTC">TOTE CAN</option>
                  <option value="TLD">TRAILER\CONTAINER LOAD (RAIL)</option>
                  <option value="TRY">TRAY</option>
                  <option value="TRK">TRUNK OR CHEST</option>
                  <option value="TSS">TRUNK,SALESMAN SAMPLE</option>
                  <option value="TUB">TUB</option>
                  <option value="TBE">TUBE</option>
                  <option value="UNT">UNIT</option>
                  <option value="UNP">UNPACKED</option>
                  <option value="VPK">VAN PACK</option>
                  <option value="VEH">VEHICLES</option>
                  <option value="WLC">WHEELED CARRIER</option>
                  <option value="DM2">WOODEN BOX</option>
                  <option value="WDC">WOODEN CASE</option>
                  <option value="DM1">WOODEN CRATE</option>
                  <option value="WRP">WRAPPED</option>
                </select>
              )}
            />
            <Form.Text className="error">
              {errors?.cargoItems
                ? errors.cargoItems[index]?.cargoType
                  ? errors.cargoItems[index]?.cargoType.message
                  : ""
                : ""}
            </Form.Text>
          </div>
        </div>
        <div className="descriptiondiv">
          <TextArea
            formProps={{
              control,
              name: `cargoItems.${index}.description`,
            }}
            row="3"
            cols="59"
            className="ctext"
            parentClassName="ctextdiv"
          />
          {/* <textarea
            {...register(`cargoItems.${index}.description`)}
            rows={7}
            cols="59"
            className="field_b"
          />
          <Form.Text className="error">
            {errors?.cargoItems
              ? errors.cargoItems[index]?.description?.message
              : ""}
          </Form.Text> */}
        </div>
        <div className="fourthdiv">
          <FormInput
            formProps={{
              control,
              name: `cargoItems.${index}.grossWeight`,
            }}
            className="cinput"
          />
          {/* <input
            {...register(`cargoItems.${index}.grossWeight`)}
            type="text"
            className="field_r"
           
          /> */}
          {/* <Form.Text className="error">
            {errors?.cargoItems
              ? errors.cargoItems[index]?.grossWeight?.message
              : ""}
          </Form.Text> */}
        </div>
        <div className="fifthdiv">
          <FormInput
            formProps={{
              control,
              name: `cargoItems.${index}.measurement`,
            }}
            // className="declaredinput"
          />
          {/* <input
            {...register(`cargoItems.${index}.measurement`)}
            type="text"
            className="field_b"
            onWheel={() => document.activeElement.blur()}
            // name="measurement"
          />
          <Form.Text className="error">
            {errors?.cargoItems
              ? errors.cargoItems[index]?.measurement?.message
              : ""}
          </Form.Text> */}
        </div>
        <div>
          {index != 0 && (
            <DeleteIcon
              style={{ color: "red" }}
              onClick={() => remove(index)}
            />
          )}
        </div>
      </div>
    );
  });

  const previewHbl = () => {
    let payload = {};
    let data = getValues();
    data.prepaidtotal = data.correction.reduce((accumulator, item) => {
      return parseInt(accumulator) + parseInt(item.prepaid ? item.prepaid : 0);
    }, 0);
    data.collecttotal = data.correction.reduce((accumulator, item) => {
      return parseInt(accumulator) + parseInt(item.collect ? item.collect : 0);
    }, 0);
    data.correction = data.correction.filter(
      (item) => item.subjectionCorrection && item.prepaid && item.collect
    );
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
    openFileNewWindow(payload);
  };

  return (
    <section className="hbl-section">
      <h1 className="hbl-heading">HBL Document</h1>
      <form onSubmit={handleSubmit(formSubmitHandler)}>
        <div className="first-container">
          <div className="first-container-item">
            <div className="left-item">
              <TextArea
                formProps={{
                  control,
                  name: "shipper",
                  label: "SHIPPER",
                }}
                maxLength="472"
                rows="7"
                cols="57"
                className="shipper"
              />
            </div>
            <div className="first-right-item">
              <div className="row-flex documentnumberdiv">
                <div>
                  <FormInput
                    formProps={{
                      control,
                      name: "documentNo",
                      label: "DOCUMENT NUMBER",
                    }}
                    mandatory={true}
                  />
                </div>
                <div>
                  <Form.Label>HOUSE BL NUMBER</Form.Label>
                  <p className="red">N/A</p>
                </div>
              </div>
              <div className="exportdiv">
                <TextArea
                  formProps={{
                    control,
                    name: "shipperExportReferences",
                    label: "EXPORT REFERENCES",
                  }}
                  maxLength="380"
                  rows="3"
                  cols="57"
                />
              </div>
            </div>
          </div>
          <div className="first-container-item">
            <div className="left-item">
              <TextArea
                style={{ width: "70%" }}
                formProps={{
                  control,
                  name: "consignee",
                  label: "CONSIGNEE :",
                }}
                maxLength="472"
                rows="7"
                cols="57"
                className="shipper"
              />
            </div>
            <div className="first-right-item">
              <div className="row-flex documentnumberdiv">
                <div>
                  <TextArea
                    formProps={{
                      control,
                      name: "destinationAgent",
                      label: "DESTINATION AGENT",
                    }}
                    mandatory={true}
                    maxLength="380"
                    rows="3"
                    cols={57}
                  />
                </div>
              </div>
              <div className="pointStatediv">
                <FormInput
                  formProps={{
                    control,
                    name: "pointStateOfOrigin",
                    label: "POINT(STATE) OF ORIGIN OR F T Z NUMBER",
                  }}
                />
              </div>
            </div>
          </div>
          <div className="first-container-item">
            <div className="left-item">
              <TextArea
                style={{ width: "70%" }}
                formProps={{
                  control,
                  name: "notifyParty",
                  label: " NOTIFY PARTY (Name and address) :",
                }}
                maxLength="472"
                rows="7"
                cols="57"
              />
            </div>
            <div className="first-right-item">
              <div className="exportdiv">
                <TextArea
                  formProps={{
                    control,
                    name: "notifyPartyExportReferences",
                    label: "EXPORT REFERENCES",
                  }}
                  maxLength="590"
                  rows="5"
                  cols="57"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="second-container">
          <div className="second-container-first-item">
            <div className="firstdiv">
              <FormInput
                formProps={{
                  control,
                  name: "preCarriageBy",
                  label: "PRE-CARRIAGE BY",
                }}
              />
            </div>
            <div className="seconddiv">
              <FormInput
                formProps={{
                  control,
                  name: "placeOfReceiptByPreCarrier",
                  label: "PLACE OF RECEIPT BY PRE-CARRIER",
                }}
              />
            </div>
            <div>
              <Form.Label htmlFor="oceanCarrier">
                OCEAN CARRIER <span className="red">*</span>
              </Form.Label>
              <Form.Select
                aria-label="Default select example"
                id="ocean_carrier"
                name="oceanCarrier"
                className="fields_r oceanselect rselect"
                {...register("oceanCarrier")}
              >
                <option value=""></option>
                <option value="-">ADMIRAL Container Line Inc</option>
                <option value="-">AKKON LINES</option>
                <option value="-">AKKON LINES</option>
                <option value="ANRM">
                  ALIANCA NAVEGACAO &amp; LOGISTICA LTD - ANRM
                </option>
                <option value="AUSY">ALPI U S A INC - AUSY</option>
                <option value="ALCH">ALTEX CHARTERED INC - ALCH</option>
                <option value="AEIG">
                  AMERICAN INTL CARGO SERVICES - AEIG
                </option>
                <option value="APLU">AMERICAN PRESIDENT LINES - APLU</option>
                <option value="AROF">AMERICAN ROLL-ON ROLL-OFF - AROF</option>
                <option value="ANNU">ANL CONTAINER LINE - ANNU</option>
                <option value="ANLC">
                  ANL CONTAINER LINE PTY LIMITED - ANLC
                </option>
                <option value="AMLU">
                  ANTILLEAN MARINE SHIPPING CORP - AMLU
                </option>
                <option value="ANLU">ANTILLES TRANSPORT LINES - ANLU</option>
                <option value="APLL">APL LOGISTICS - APLL</option>
                <option value="ARKU">
                  Arkas Container Transport S.A. - ARKU
                </option>
                <option value="ASTS">ASSOCIATED TRANSPORT - ASTS</option>
                <option value="ACLU">ATLANTIC CONTAINER LINES - ACLU</option>
                <option value="ARRJ">ATLANTIC RO-RO CARRIERS INC - ARRJ</option>
                <option value="AUSW">AUSTRAL ASIA LINE PTE LTD - AUSW</option>
                <option value="ANZD">
                  AUSTRALIA-NEW ZEALAND DIRECT LINE - ANZD
                </option>
                <option value="BLJU">AVANA GLOBAL FZCO</option>
                <option value="BANR">BAL Container Line - BANR</option>
                <option value="-">BALTIC SHIPPING LINE</option>
                <option value="BBCH">
                  BBC CHARTERING &amp; LOGISTIC GMBH - BBCH
                </option>
                <option value="BUGA">BELUGA CHARTERING GMBH - BUGA</option>
                <option value="-">Bengal tiger line</option>
                <option value="BCLU">BERMUDA CONTAINER LINE LTD - BCLU</option>
                <option value="BILH">BIGLIFT SHIPPING BV</option>
                <option value="BIMH">BIMINI SHIPPING LLC - BIMH</option>
                <option value="BLUE">
                  BLUESHELL SHIPPING LTD NICOSIA - BLUE
                </option>
                <option value="-">Borchard Lines</option>
                <option value="BTEL">BRAS-TEX EXPRESS LINE L P - BTEL</option>
                <option value="-">BROINTERMED LINES LIMITED</option>
                <option value="-">Canada State Africa Line</option>
                <option value="CCAR">CAROLINA CARRIBEAN LINE - CCAR</option>
                <option value="CCNR">CCNI - CCNR</option>
                <option value="CCNI">CCNI COMPANIA CHILEAN DE - CCNI</option>
                <option value="ANQI">CDS OVERSEAS INC - ANQI</option>
                <option value="CHHK">
                  CHINA SHIPPING CONTAINER LINES - CHHK
                </option>
                <option value="CHNJ">CHINA SHIPPING NORTH AMERICA -CHNJ</option>
                <option value="CULV">CHINA UNITED LINES LTD. - CULV</option>
                <option value="CPJQ">
                  CHINESE-POLISH JOINT STOCK SHIPPING - CPJQ
                </option>
                <option value="CKLU">CK Line - CKLU</option>
                <option value="-">CMA CGM</option>
                <option value="CMDU">CMA-CGM (AMERICA) INC - CMDU</option>
                <option value="CDNH">
                  COLUMBIA CONTAINER LINES INC - CDNH
                </option>
                <option value="CBLA">
                  COMBI LINE INTERNATIONAL SPA - CBLA
                </option>
                <option value="CGMU">COMPAGNIE GENERALE MARITIME - CGMU</option>
                <option value="-">Compagnie Tunisienne de navigation</option>
                <option value="CLIB">
                  COMPANHIA LIBRA DE NAVEGACAO BRAZIL -CLIB
                </option>
                <option value="CNIU">
                  COMPANIA CHILENA DE NAVEGACION - CNIU
                </option>
                <option value="CPLB">
                  COMPANIA LIBRA DE NAVEGACION - CPLB
                </option>
                <option value="CHIW">
                  COMPANIA SUD AMERICANA DE VAPORES - CHIW
                </option>
                <option value="-">Contenemar</option>
                <option value="-">Conti-Lines</option>
                <option value="PSBU">CONTSHIP -- PSBU</option>
                <option value="CCXL">CONTSHIP CONTAINER LINES - CCXL</option>
                <option value="COSU">COSCO Container Lines - COSU</option>
                <option value="COEU">
                  COSCO SHIPPING LINES (EUROPE) - COEU
                </option>
                <option value="CQSQ">COSCO SHIPPING SPECIALIZED - CQSQ</option>
                <option value="-">Costa Container Lines</option>
                <option value="CPSU">CP SHIPS - CPSU</option>
                <option value="ITAU">CP SHIPS - ITAU</option>
                <option value="CPSP">CP SHIPS USA LLC - CPSP</option>
                <option value="CWYB">CROWLEY - CWYB</option>
                <option value="CAMN">CROWLEY AMERICAN TRANSPORT - CAMN</option>
                <option value="CATY">CROWLEY AMERICAN TRANSPORT - CATY</option>
                <option value="CWLQ">CROWLEY CARIBBEAN SERVICES - CWLQ</option>
                <option value="CLAM">
                  CROWLEY LATIN AMERICA SERVICES - CLAM
                </option>
                <option value="CPRC">
                  CROWLEY PUERTO RICO SERVICES - CPRC
                </option>
                <option value="CSVV">
                  CSAV SUD AMERICANA DE VAPORES - CSVV
                </option>
                <option value="-">CTP Line</option>
                <option value="DPLN">DEPPE LINIE GMBH &amp; CO -- DPLN</option>
                <option value="DAYU">DEUTSCHE AFRIKA LINIEN GMBH - DAYU</option>
                <option value="DWCH">DEWELL CONTAINER SHIPPING - DWCH</option>
                <option value="DOLQ">DOLE OCEAN CARGO EXPRESS - DOLQ</option>
                <option value="-">Dongnama Shipping</option>
                <option value="ECLR">EASTERN CAR LINER LTD - ECLR</option>
                <option value="EIMU">EIMSKIP EHF - EIMU</option>
                <option value="ECLK">ELLERMAN LINES - ECLK</option>
                <option value="EPIR">
                  EMIRATES SHIPPING (HONG KONG) LTD - EPIR
                </option>
                <option value="EGLV">EVERGREEN LINE - EGLV</option>
                <option value="FAIR">
                  FAIRWEATHER STEAMSHIP CO LTD - FAIR
                </option>
                <option value="-">FEEDERTECH</option>
                <option value="FANE">
                  FESCO AGENCIES NORTH AMERICA INC - FANE
                </option>
                <option value="FLNV">FRONTIER LINER SERVICES - FLNV</option>
                <option value="GGME">G &amp; G MARINE INC - GGME</option>
                <option value="GCHY">
                  GRAND CHINA SHIPPING YANTAI CO - GCHY
                </option>
                <option value="-">GRANDI NAVI VELOCI</option>
                <option value="GWSN">GREAT WESTERN STEAMSHIP CO - GWSN</option>
                <option value="GSSV">
                  GRIEG STAR SHIPPING AS (CONTAINER) - GSSV
                </option>
                <option value="GSSW">
                  GRIEG STAR SHIPPING AS (OPEN HATCH) - GSSW
                </option>
                <option value="GDSL">GRIMALDI DEEP SEA S P A</option>
                <option value="GESM">GRIMALDI EUROMED S P A</option>
                <option value="GRIU">GRIMALDI Lines - GRIU</option>
                <option value="CGUF">GULF UNITED ARAB EMIRATES - CGUF</option>
                <option value="STIN">H. LINEN STINNES, GMBH - STIN</option>
                <option value="IRSU">
                  Hafiz Darya Shipping Lines (HDS LINES) - IRSU
                </option>
                <option value="HTSG">HAITI SHIPPING LINES INC - HTSG</option>
                <option value="SUDU">HAMBURG SUD / COLUMBUS LINE - SUDU</option>
                <option value="HJSC">HANJIN SHIPPING COMPANY - HJSC</option>
                <option value="HHLW">HANSA HEAVY LIFT - HHLW</option>
                <option value="HLCU">HAPAG-LLOYD - HLCU</option>
                <option value="HLUS">HAPAG-LLOYD USA LLC - HLUS</option>
                <option value="HTML">HATSU MARINE - HTML</option>
                <option value="11QU">Heung-A Shipping Co., Ltd.</option>
                <option value="HUAU">Hoegh Autoliners - HUAU</option>
                <option value="HOEG">Hoegh Autoliners AS - HOEG</option>
                <option value="HRZU">Horizon Lines - HRZU</option>
                <option value="-">HUBLine Berhad</option>
                <option value="HDMU">HYUNDAI MERCHANT MARINE - HDMU</option>
                <option value="-">Ignazio Messina &amp; C. S.p.A. </option>
                <option value="IILU">INDEPENDENT CONTAINER LINE - IILU</option>
                <option value="IDMC">
                  Industrial Marine Carriers (Intermarine) - IDMC
                </option>
                <option value="IDMC">
                  INDUSTRIAL MARITIME CARRIERS - IDMC
                </option>
                <option value="12AT">Interasia Lines - 12AT</option>
                <option value="INOC">INTEROCEAN LINES INC - INOC</option>
                <option value="IDNL">
                  ITALIA DI NAVIGAZIONE S PLAINFIELD - IDNL
                </option>
                <option value="ITMA">ITALIA MARITIMMA S P A - ITMA</option>
                <option value="11WJ">JJ Shipping</option>
                <option value="KKLU">K LINE (INDIA) PRIVATE LIMITED</option>
                <option value="KKLU">K Line (Thailand) Ltd.</option>
                <option value="KKLU">K LINE AMERICA - KKLU</option>
                <option value="KCDA">
                  KALYPSO COMPAGNIA DI NAVIGAZIONE - KCDA
                </option>
                <option value="KLSL">KENT LINE SALES LIMITED - KLSL</option>
                <option value="KHUG">KIEN HUNG SHIPPING CO LTD - KHUG</option>
                <option value="KOSL">KING OCEAN SERVICES LTD - KOSL</option>
                <option value="KMTC">
                  Korea Maritime Transport Co., Ltd. - KMTC
                </option>
                <option value="KNDU">KUEHNE AND NAGEL OVERSEAS - KNDU</option>
                <option value="LCBC">LCL LINES - LCBC</option>
                <option value="LBNA">
                  LIBRA NAVEGACAO S A RIO DE JANEIRO - LBNA
                </option>
                <option value="LTNV">
                  LLOYD TRIESTINA DI NAVIGAZIONE - LTNV
                </option>
                <option value="LTIU">
                  LLOYD TRIESTINO DI NAVIGAZIONE - LTIU
                </option>
                <option value="-">LOG-IN LOGISTICA INTERMODAL</option>
                <option value="LYKU">LYKES BROTHERS LINES - LYKU</option>
                <option value="LYKL">LYKES LINES -LYKL</option>
                <option value="MCAW">MACANDREWS AND CO LTD - MCAW</option>
                <option value="MCSM">
                  MACS MARITIME CARRIER SHIPPING - MCSM
                </option>
                <option value="MWHL">MADRIGAL - WAN HAI LINES - MWHL</option>
                <option value="MAEU">MAERSK STEAMSHIP LINE - MAEU</option>
                <option value="MISC">
                  Malaysia International Shipping Corporation Berhad - MISC
                </option>
                <option value="MFUS">MARFRET (USA) INC - MFUS</option>
                <option value="MEPE">
                  MARIANA EXPRESS LINES (MELL) - MEPE
                </option>
                <option value="MXRS">Marine Express - MXRS </option>
                <option value="-">
                  Maritime Carrier Shipping Center GmbH &amp; Co. (MACS)
                </option>
                <option value="MRUB">MARUBA S C A - MRUB</option>
                <option value="MATS">MATSON NAVIGATION COMPANY - MATS</option>
                <option value="MEDU">MEDITERREAN SHIPPING INC - MEDU</option>
                <option value="MSCU">MEDITERREAN SHIPPING INC - MSCU</option>
                <option value="MECU">MELFI MARINE CORP - MECU</option>
                <option value="-">Mercosul Line</option>
                <option value="-">Metz Container Line</option>
                <option value="MOLU">MITSUI O S K LINES LTD - MOLU</option>
                <option value="MMMA">MONTEMAR MARITIMA S A - MMMA</option>
                <option value="-">MTL FEEDER</option>
                <option value="-">N.Y.S LINES</option>
                <option value="NAQA">NACA CARSON, CA - NAQA</option>
                <option value="-">Namsung Shipping Co., Ltd. </option>
                <option value="NSAU">
                  NATIONAL SHIPPING CO OF SAUDI ARABIA - NSAU
                </option>
                <option value="-">Navibulgar</option>
                <option value="NOSU">Neptune Shipping Line - NOSU</option>
                <option value="NIDU">NILE DUTCH AFRICA LINE B.V</option>
                <option value="NIRI">NIRINT SHIPPING BV - NIRI</option>
                <option value="NCLL">NORASIA CONTAINER LINES LTD - NCLL</option>
                <option value="NODA">NORDANA LINE AS - NODA</option>
                <option value="NODA">Nordana Shipping Line - NODA</option>
                <option value="NYKS">NYK LINE - NYKS</option>
                <option value="ONEY">Ocean Network Express - ONEY</option>
                <option value="OSCN">OCEAN STAR CONTAINER LINES - OSCN</option>
                <option value="OCEA">
                  OCEANBULK SHIPPING &amp; TRADING - OCEA
                </option>
                <option value="OLIM">OCEANUS LINE - OLIM</option>
                <option value="ONEG">
                  ONEGO SHIPPING AND CHARTERING - ONEG
                </option>
                <option value="-">
                  Orient Express Lines Singapore (Pte) Ltd. (OEL)
                </option>
                <option value="OOLU">
                  ORIENT OVERSEAS CONTAINER LINE - OOLU
                </option>
                <option value="PSHY">P O SHIPPING - PSHY</option>
                <option value="POCL">P&amp;O NEDLLOYD - POCL</option>
                <option value="PABV">PACIFIC INTERNATIONAL LINES - PABV</option>
                <option value="PCFQ">
                  PACIFIC SINO TRANSPORTATION INC - PCFQ
                </option>
                <option value="-">PERMA CONTAINER LINE</option>
                <option value="PWTD">
                  PINNACLE WORLD TRANSPORT PTE LTD - PWTD
                </option>
                <option value="QNLU">Qatar Navigation Line</option>
                <option value="REGU">Regional Container Lines - REGU</option>
                <option value="RCKI">
                  Rickmers Linie (America) Inc. - RCKI
                </option>
                <option value="SAFM">SAF MARINE LINE - SAFM</option>
                <option value="SBDU">SAMBAND LINE - SBDU</option>
                <option value="-">Samudera Shipping Line Ltd</option>
                <option value="SBPS">SEA BRIDGE MARINE INC - SBPS</option>
                <option value="-">Sea Consortium (Seacon)</option>
                <option value="SEFN">SEA FREIGHT - SEFN</option>
                <option value="SSLH">SEA STAR LINE SSLH</option>
                <option value="SEAU">SEA-LAND - SEAU</option>
                <option value="SMLU">SEABOARD MARINE LTD - SMLU</option>
                <option value="SEJJ">Seago Line - SEJJ</option>
                <option value="SENU">SENATOR LINES GMBH --SENU</option>
                <option value="SSPH">
                  SETH SHIPPING CORP HONG KONG - SSPH
                </option>
                <option value="-">Shanghai Hai Hua (Hasco)</option>
                <option value="SHPT">SHIPCO TRANSPORT INC - SHPT</option>
                <option value="SCJU">SHIPPING CORP. OF INDIA, LTD -SCJU</option>
                <option value="SOQO">
                  SINO OCEAN SHIPPING HONG KONG - SOQO
                </option>
                <option value="SKLU">
                  Sinokor Merchant Marine Co., Ltd. - SKLU
                </option>
                <option value="SNBU">SINOTRANS CONTAINER LINES - SNBU</option>
                <option value="SNTU">SINOTRANS SHIPPING AGENCY - SNTU</option>
                <option value="12PD">
                  SITC CONTAINER LINES CO., LTD - 12PD
                </option>
                <option value="SMLM">SM LINE CORPORATION - SMLM</option>
                <option value="SFFV">SPLIETHOFF TRANSPORT BV - SFFV</option>
                <option value="SAXC">STAR SHIPPING A S - SAXC</option>
                <option value="SSHF">STAR SHIPPING A/S - SSHF</option>
                <option value="THCT">T.S. Lines limited</option>
                <option value="-">Tanto Intim Line</option>
                <option value="GETU">TARROS S.P.A - GETU</option>
                <option value="TLNU">TECMARINE LINES INC. -- TLNU</option>
                <option value="-">Temas Line</option>
                <option value="THZS">Thorco Shipping (TS) - THZS</option>
                <option value="THZS">THORCO SHIPPING A/S - THZS</option>
                <option value="-">Tianjin Marine Shipping Co. Ltd.</option>
                <option value="-">Trans Asia Line</option>
                <option value="TPCS">TRANS-PACIFIC LINES LTD - TPCS</option>
                <option value="MXLU">
                  TRANSPORTACION MARITIMA MEXICANA - MXLU
                </option>
                <option value="TSCW">
                  TROPICAL SHIPPING &amp; CONSTRUCTION - TSCW
                </option>
                <option value="TRKU">
                  TURKON CONTAINER TRANS &amp; SHIPPING -TRKU
                </option>
                <option value="USLB">U S LINES LIMITED - USLB</option>
                <option value="UNIC">UNICARGO EXPRESS INC - UNIC</option>
                <option value="-">UniFeeder</option>
                <option value="UASU">UNITED ARAB SHIPPING CO-- UASU</option>
                <option value="UASC">
                  United Arab Shipping Company Co. (S.A.G) - UASC
                </option>
                <option value="-">United Feeder Services</option>
                <option value="UALC">Universal Africa Lines - UALC</option>
                <option value="VMLU">VASCO MARITIME PTE LTD</option>
                <option value="WLWH">
                  WALLENIUS WILHELMSEN LINES LYSAKER - WLWH
                </option>
                <option value="WHLC">WAN HAI LINES LTD - WHLC</option>
                <option value="WECU">WEC LINES - WECU</option>
                <option value="WWSU">WESTWOOD SHIPPING LINES - WWSU</option>
                <option value="WLHN">WILHELMSEN LINES - WLHN</option>
                <option value="YMPR">
                  Yang Ming (Singapore) Pte. Ltd.- YMPR
                </option>
                <option value="YMLU">Yang Ming Line - YMLU</option>
                <option value="ZIMU">
                  ZIM INTEGRATED SHIPPING SERVICES LTD. - ZIMU
                </option>
              </Form.Select>
              <Form.Text className="error">
                {errors.oceanCarrier ? errors?.oceanCarrier.message : ""}
              </Form.Text>
            </div>
            <div>
              <Form.Label htmlFor="source">
                SOURCE <span className="red">*</span>
              </Form.Label>
              <Form.Select
                aria-label="Default select example"
                {...register("source")}
                id="source"
                name="source"
                className="fields_r sourceselect rselect"
              >
                <option value=""></option>
                <option value="carrier tariff">Carrier Tariff</option>
                <option value="co-loader">Co-Loader</option>
              </Form.Select>
              <Form.Text className="error">
                {errors.source ? errors?.source.message : ""}
              </Form.Text>
            </div>
            <div>
              <FormInput
                formProps={{
                  control,
                  name: "contractReference",
                  label: "CONTRACT REFERENCE",
                }}
              />
            </div>
          </div>
          <div className="second-container-second-item">
            <div className="firstdiv">
              <FormInput
                formProps={{
                  control,
                  name: "exportVessel",
                  label: "Export Vessel / Voyage",
                }}
              />
            </div>
            <div className="seconddiv">
              <Form.Label htmlFor="portOfLoading">
                PORT OF LOADING <span className="red">*</span>
              </Form.Label>
              <Form.Select
                aria-label="Default select example"
                {...register("portOfLoading")}
                id="portOfLoading"
                name="portOfLoading"
                className="fields_r portOfLoadingselect rselect"
              >
                <option value=""></option>
                <option value="HAZIRA PORT IN INDIA">
                  {" "}
                  HAZIRA PORT IN INDIA
                </option>

                <option value=" ISTANBUL KUMPORT,TURKEY ">
                  {" "}
                  ISTANBUL KUMPORT,TURKEY{" "}
                </option>

                <option value=" IZMIT EVYAP PORT-TURKEY">
                  {" "}
                  IZMIT EVYAP PORT-TURKEY
                </option>

                <option value=" MAPUTO PORT, MOZAMBIQUE">
                  {" "}
                  MAPUTO PORT, MOZAMBIQUE
                </option>

                <option value="AABENRAA,  DENMARK">AABENRAA, DENMARK</option>

                <option value="AALBORG, DENMARK">AALBORG, DENMARK</option>

                <option value="AALESUND,  NORWAY">AALESUND, NORWAY</option>

                <option value="AARDAL;AARDALSTANGEN,NORWAY">
                  AARDAL;AARDALSTANGEN,NORWAY
                </option>

                <option value="AARHUS, DENMARK">AARHUS, DENMARK</option>

                <option value="ABERDEEN, SCOTLAND">ABERDEEN, SCOTLAND</option>

                <option value="ABIDJAN, IVORY COAST">
                  ABIDJAN, IVORY COAST
                </option>

                <option value="ABU DHABI, U.A.E.">ABU DHABI, U.A.E.</option>

                <option value="ABU QIR/ABUKIR/ABU KIR B,EGYPT">
                  ABU QIR/ABUKIR/ABU KIR B,EGYPT
                </option>

                <option value="ABU ZABY, ARAB EM.">ABU ZABY, ARAB EM.</option>

                <option value="ACAJUTLA, EL SALV.">ACAJUTLA, EL SALV.</option>

                <option value="ACAPULCO, MEX.">ACAPULCO, MEX.</option>

                <option value="ACCRA, GHANA">ACCRA, GHANA</option>

                <option value="AD DAMMAM, SAUDI ARABIA">
                  AD DAMMAM, SAUDI ARABIA
                </option>

                <option value="AD DAMMAN; DAMMAN, SAUDI ARAB.">
                  AD DAMMAN; DAMMAN, SAUDI ARAB.
                </option>

                <option value="ADELAIDE, AUSTRALIA">ADELAIDE, AUSTRALIA</option>

                <option value="ADEN, YEMEN">ADEN, YEMEN</option>

                <option value="AGADIR, MOROCCO">AGADIR, MOROCCO</option>

                <option value="AGUADULCE, COSTA RICA">
                  AGUADULCE, COSTA RICA
                </option>

                <option value="AGUADULCE, PANAMA">AGUADULCE, PANAMA</option>

                <option value="AHMEDABAD ICD , INDIA">
                  AHMEDABAD ICD , INDIA
                </option>

                <option value="AHUS, SWEDEN">AHUS, SWEDEN</option>

                <option value="AIN SUKHNA, EGYPT">AIN SUKHNA, EGYPT</option>

                <option value="AIOI, JAPAN">AIOI, JAPAN</option>

                <option value="AJMAN, UAE">AJMAN, UAE</option>

                <option value="AKITA KO, JAPAN">AKITA KO, JAPAN</option>

                <option value="AKRANES, ICELAND">AKRANES, ICELAND</option>

                <option value="AKUREYRI, ICELAND">AKUREYRI, ICELAND</option>

                <option value="AL JUBAIL; JUBAIL, SAUDI ARAB.">
                  AL JUBAIL; JUBAIL, SAUDI ARAB.
                </option>

                <option value="AL KHUBAR, SAUDI ARABIA">
                  AL KHUBAR, SAUDI ARABIA
                </option>

                <option value="AL SOKHNA">AL SOKHNA</option>

                <option value="ALBERNI, BC, CA.">ALBERNI, BC, CA.</option>

                <option value="ALCANAR, SPAIN">ALCANAR, SPAIN</option>

                <option value="ALERT BAY, BC">ALERT BAY, BC</option>

                <option value="ALEXANDRIA SEAPORT, EGYPT ">
                  ALEXANDRIA SEAPORT, EGYPT{" "}
                </option>

                <option value="ALEXANDRIA, EGYPT">ALEXANDRIA, EGYPT</option>

                <option value="ALGECIRAS, SPAIN">ALGECIRAS, SPAIN</option>

                <option value="ALGIERS, ALGERIA">ALGIERS, ALGERIA</option>

                <option value="ALIAGA IZMIR PORT,TURKEY">
                  ALIAGA IZMIR PORT,TURKEY
                </option>

                <option value="ALIAGA PORT, TURKEY">ALIAGA PORT, TURKEY</option>

                <option value="ALIAGA, IZMIR, TURKIYE">
                  ALIAGA, IZMIR, TURKIYE
                </option>

                <option value="ALICANTE, SPAIN">ALICANTE, SPAIN</option>

                <option value="ALIVER, GREECE">ALIVER, GREECE</option>

                <option value="ALL CAROLINE IS PORT, KIRIBAT">
                  ALL CAROLINE IS PORT, KIRIBAT
                </option>

                <option value="ALL COLOMBIA AMAZON PORTS">
                  ALL COLOMBIA AMAZON PORTS
                </option>

                <option value="ALL COMOROS PORTS">ALL COMOROS PORTS</option>

                <option value="ALL CORSICA PORTS">ALL CORSICA PORTS</option>

                <option value="ALL FALKLAND ISLANDS PORTS">
                  ALL FALKLAND ISLANDS PORTS
                </option>

                <option value="ALL FAROE ISLAND PORTS">
                  ALL FAROE ISLAND PORTS
                </option>

                <option value="ALL FRENCH GUIANA PORTS">
                  ALL FRENCH GUIANA PORTS
                </option>

                <option value="ALL FRENCH SO &amp; ANTARCTIC LAND">
                  ALL FRENCH SO &amp; ANTARCTIC LAND
                </option>

                <option value="ALL GILBERT IS PORTS, KIRIBAT">
                  ALL GILBERT IS PORTS, KIRIBAT
                </option>

                <option value="ALL GUINEA-BISSAU PORTS">
                  ALL GUINEA-BISSAU PORTS
                </option>

                <option value="ALL MOLUCCAS PORTS">ALL MOLUCCAS PORTS</option>

                <option value="ALL OTH ARGENTINA PORTS">
                  ALL OTH ARGENTINA PORTS
                </option>

                <option value="ALL OTH BELGIUM PORTS">
                  ALL OTH BELGIUM PORTS
                </option>

                <option value="ALL OTH BRIT INDN OCEAN TER PT">
                  ALL OTH BRIT INDN OCEAN TER PT
                </option>

                <option value="ALL OTH CAICOS ISLANDS PORTS">
                  ALL OTH CAICOS ISLANDS PORTS
                </option>

                <option value="ALL OTH CANARY ISLANDS PORTS">
                  ALL OTH CANARY ISLANDS PORTS
                </option>

                <option value="ALL OTH CAYMAN ISLAND PORTS">
                  ALL OTH CAYMAN ISLAND PORTS
                </option>

                <option value="ALL OTH COASTA RICA CARIB PTS">
                  ALL OTH COASTA RICA CARIB PTS
                </option>

                <option value="ALL OTH COLOMBIA W COAST PORTS">
                  ALL OTH COLOMBIA W COAST PORTS
                </option>

                <option value="ALL OTH COLOMBIAN CARIB PORTS">
                  ALL OTH COLOMBIAN CARIB PORTS
                </option>

                <option value="ALL OTH COSTA RICA W COAST PTS">
                  ALL OTH COSTA RICA W COAST PTS
                </option>

                <option value="ALL OTH DOMINICAN REP. PORTS">
                  ALL OTH DOMINICAN REP. PORTS
                </option>

                <option value="ALL OTH EGYPT MEDITERRANEAN PT">
                  ALL OTH EGYPT MEDITERRANEAN PT
                </option>

                <option value="ALL OTH EGYPT RED SEA REG PORT">
                  ALL OTH EGYPT RED SEA REG PORT
                </option>

                <option value="ALL OTH EL SALVADOR PORTS">
                  ALL OTH EL SALVADOR PORTS
                </option>

                <option value="ALL OTH ENGLAND S &amp; E COAST PT">
                  ALL OTH ENGLAND S &amp; E COAST PT
                </option>

                <option value="ALL OTH ENGLAND WEST COAST PTS">
                  ALL OTH ENGLAND WEST COAST PTS
                </option>

                <option value="ALL OTH FRANCE ATLANTIC PORTS">
                  ALL OTH FRANCE ATLANTIC PORTS
                </option>

                <option value="ALL OTH FRANCE MEDITRAN. PORTS">
                  ALL OTH FRANCE MEDITRAN. PORTS
                </option>

                <option value="ALL OTH GEORGIA PORTS">
                  ALL OTH GEORGIA PORTS
                </option>

                <option value="ALL OTH GUADELOUPE PORTS">
                  ALL OTH GUADELOUPE PORTS
                </option>

                <option value="ALL OTH GUATEMALA CARIB PORTS">
                  ALL OTH GUATEMALA CARIB PORTS
                </option>

                <option value="ALL OTH GUATEMALA W.COAST PTS">
                  ALL OTH GUATEMALA W.COAST PTS
                </option>

                <option value="ALL OTH GUYANA PORTS">
                  ALL OTH GUYANA PORTS
                </option>

                <option value="ALL OTH HAITI PORTS">ALL OTH HAITI PORTS</option>

                <option value="ALL OTH HONDURAS CARIB PORTS">
                  ALL OTH HONDURAS CARIB PORTS
                </option>

                <option value="ALL OTH ICELAND PORTS">
                  ALL OTH ICELAND PORTS
                </option>

                <option value="ALL OTH INDIA EAST COAST PORTS">
                  ALL OTH INDIA EAST COAST PORTS
                </option>

                <option value="ALL OTH IRELAND PORTS">
                  ALL OTH IRELAND PORTS
                </option>

                <option value="ALL OTH ISRAEL MEDITERR. PORTS">
                  ALL OTH ISRAEL MEDITERR. PORTS
                </option>

                <option value="ALL OTH JAMAICA PORTS">
                  ALL OTH JAMAICA PORTS
                </option>

                <option value="ALL OTH LEEWARD ISLAND PORTS">
                  ALL OTH LEEWARD ISLAND PORTS
                </option>

                <option value="ALL OTH MARTINIQUE PORTS">
                  ALL OTH MARTINIQUE PORTS
                </option>

                <option value="ALL OTH MEXICO EAST COAST PTS">
                  ALL OTH MEXICO EAST COAST PTS
                </option>

                <option value="ALL OTH MOROCCO ATLANTIC REG.">
                  ALL OTH MOROCCO ATLANTIC REG.
                </option>

                <option value="ALL OTH MOROCCO MEDITRN PORTS">
                  ALL OTH MOROCCO MEDITRN PORTS
                </option>

                <option value="ALL OTH NETHERLAND ANTILLES PT">
                  ALL OTH NETHERLAND ANTILLES PT
                </option>

                <option value="ALL OTH NETHERLANDS PORTS">
                  ALL OTH NETHERLANDS PORTS
                </option>

                <option value="ALL OTH NICARAGUAN CARIB PORTS">
                  ALL OTH NICARAGUAN CARIB PORTS
                </option>

                <option value="ALL OTH NICARAGUAN W COAST PTS">
                  ALL OTH NICARAGUAN W COAST PTS
                </option>

                <option value="ALL OTH NORTHERN IRELAND PORTS">
                  ALL OTH NORTHERN IRELAND PORTS
                </option>

                <option value="ALL OTH PACIFIC ISLANDS N.E.C.">
                  ALL OTH PACIFIC ISLANDS N.E.C.
                </option>

                <option value="ALL OTH PANAMA CARIB PORTS">
                  ALL OTH PANAMA CARIB PORTS
                </option>

                <option value="ALL OTH PANAMA W COAST PORTS">
                  ALL OTH PANAMA W COAST PORTS
                </option>

                <option value="ALL OTH PARAGUAY PORTS">
                  ALL OTH PARAGUAY PORTS
                </option>

                <option value="ALL OTH PEOPLES REP. CHINA PTS">
                  ALL OTH PEOPLES REP. CHINA PTS
                </option>

                <option value="ALL OTH PORTUGAL PORTS">
                  ALL OTH PORTUGAL PORTS
                </option>

                <option value="ALL OTH SAO TOME &amp; PRINCIPE PT">
                  ALL OTH SAO TOME &amp; PRINCIPE PT
                </option>

                <option value="ALL OTH SAUDI ARABIA PORTS">
                  ALL OTH SAUDI ARABIA PORTS
                </option>

                <option value="ALL OTH SCOTLAND E COAST PORTS">
                  ALL OTH SCOTLAND E COAST PORTS
                </option>

                <option value="ALL OTH SCOTLAND W COAST PORTS">
                  ALL OTH SCOTLAND W COAST PORTS
                </option>

                <option value="ALL OTH SOCIETY ISLANDS PORTS">
                  ALL OTH SOCIETY ISLANDS PORTS
                </option>

                <option value="ALL OTH SOMALIA EASTERN REG PT">
                  ALL OTH SOMALIA EASTERN REG PT
                </option>

                <option value="ALL OTH SOUTHERN ASIA NEC PORT">
                  ALL OTH SOUTHERN ASIA NEC PORT
                </option>

                <option value="ALL OTH SOUTHERN PACIFIC ISL P">
                  ALL OTH SOUTHERN PACIFIC ISL P
                </option>

                <option value="ALL OTH SP ATL PT N OF PORTUGA">
                  ALL OTH SP ATL PT N OF PORTUGA
                </option>

                <option value="ALL OTH SP ATL PT SE OF PRTUGL">
                  ALL OTH SP ATL PT SE OF PRTUGL
                </option>

                <option value="ALL OTH SPAIN MEDTERAN. PORTS">
                  ALL OTH SPAIN MEDTERAN. PORTS
                </option>

                <option value="ALL OTH SPANISH AFRICA, N.E.C.">
                  ALL OTH SPANISH AFRICA, N.E.C.
                </option>

                <option value="ALL OTH SURINAME PORTS">
                  ALL OTH SURINAME PORTS
                </option>

                <option value="ALL OTH SWDN PRTS;HARARE SWDN">
                  ALL OTH SWDN PRTS;HARARE SWDN
                </option>

                <option value="ALL OTH TRINIDAD PORTS">
                  ALL OTH TRINIDAD PORTS
                </option>

                <option value="ALL OTH TURKEY BLK/MARMARA PT">
                  ALL OTH TURKEY BLK/MARMARA PT
                </option>

                <option value="ALL OTH TURKEY MEDITERRAN PTS.">
                  ALL OTH TURKEY MEDITERRAN PTS.
                </option>

                <option value="ALL OTH TURKS ISLANDS PORTS">
                  ALL OTH TURKS ISLANDS PORTS
                </option>

                <option value="ALL OTH UKRAINE PORTS">
                  ALL OTH UKRAINE PORTS
                </option>

                <option value="ALL OTH UNITED ARAB EMIRATE PT">
                  ALL OTH UNITED ARAB EMIRATE PT
                </option>

                <option value="ALL OTH VENEZUELA PORTS">
                  ALL OTH VENEZUELA PORTS
                </option>

                <option value="ALL OTH WINDWARD ISLAND PORTS">
                  ALL OTH WINDWARD ISLAND PORTS
                </option>

                <option value="ALL OTH YUGOSLAVIA PORTS">
                  ALL OTH YUGOSLAVIA PORTS
                </option>

                <option value="ALL OTHER ALBANIA PORTS">
                  ALL OTHER ALBANIA PORTS
                </option>

                <option value="ALL OTHER ALGERIA PORTS">
                  ALL OTHER ALGERIA PORTS
                </option>

                <option value="ALL OTHER ANGOLA PORTS">
                  ALL OTHER ANGOLA PORTS
                </option>

                <option value="ALL OTHER ATLANTIC PORTS">
                  ALL OTHER ATLANTIC PORTS
                </option>

                <option value="ALL OTHER AUSTRALIA PORTS">
                  ALL OTHER AUSTRALIA PORTS
                </option>

                <option value="ALL OTHER AZORES PORTS">
                  ALL OTHER AZORES PORTS
                </option>

                <option value="ALL OTHER BAHRAIN PORTS">
                  ALL OTHER BAHRAIN PORTS
                </option>

                <option value="ALL OTHER BANGLADESH PORTS">
                  ALL OTHER BANGLADESH PORTS
                </option>

                <option value="ALL OTHER BENIN PORTS">
                  ALL OTHER BENIN PORTS
                </option>

                <option value="ALL OTHER BERMUDA PORTS">
                  ALL OTHER BERMUDA PORTS
                </option>

                <option value="ALL OTHER BRAZIL PORTS NORTH OF RECIFE">
                  ALL OTHER BRAZIL PORTS NORTH OF RECIFE
                </option>

                <option value="ALL OTHER BRAZIL PORTS SOUTH OF RECIFE">
                  ALL OTHER BRAZIL PORTS SOUTH OF RECIFE
                </option>

                <option value="ALL OTHER BRUNEI PORTS">
                  ALL OTHER BRUNEI PORTS
                </option>

                <option value="ALL OTHER BULGARIA PORTS">
                  ALL OTHER BULGARIA PORTS
                </option>

                <option value="ALL OTHER CA PACIFIC PRTS">
                  ALL OTHER CA PACIFIC PRTS
                </option>

                <option value="ALL OTHER CAMEROON PORTS">
                  ALL OTHER CAMEROON PORTS
                </option>

                <option value="ALL OTHER CAPE VERDE PORTS">
                  ALL OTHER CAPE VERDE PORTS
                </option>

                <option value="ALL OTHER CHILE PORTS">
                  ALL OTHER CHILE PORTS
                </option>

                <option value="ALL OTHER CHINA (TAIWAN) PORTS">
                  ALL OTHER CHINA (TAIWAN) PORTS
                </option>

                <option value="ALL OTHER CROATIA PORTS">
                  ALL OTHER CROATIA PORTS
                </option>

                <option value="ALL OTHER CYPRUS PORTS">
                  ALL OTHER CYPRUS PORTS
                </option>

                <option value="ALL OTHER DENMARK PORTS">
                  ALL OTHER DENMARK PORTS
                </option>

                <option value="ALL OTHER ECUADOR PORTS">
                  ALL OTHER ECUADOR PORTS
                </option>

                <option value="ALL OTHER EQUATORIAL GUINEA PT">
                  ALL OTHER EQUATORIAL GUINEA PT
                </option>

                <option value="ALL OTHER ERITREA PORTS">
                  ALL OTHER ERITREA PORTS
                </option>

                <option value="ALL OTHER ESTONIA PORTS">
                  ALL OTHER ESTONIA PORTS
                </option>

                <option value="ALL OTHER FIJI ISLANDS PORTS">
                  ALL OTHER FIJI ISLANDS PORTS
                </option>

                <option value="ALL OTHER FINLAND PORTS">
                  ALL OTHER FINLAND PORTS
                </option>

                <option value="ALL OTHER GABON PORTS">
                  ALL OTHER GABON PORTS
                </option>

                <option value="ALL OTHER GAMBIA PORTS">
                  ALL OTHER GAMBIA PORTS
                </option>

                <option value="ALL OTHER GHANA PORTS">
                  ALL OTHER GHANA PORTS
                </option>

                <option value="ALL OTHER GREECE PORTS">
                  ALL OTHER GREECE PORTS
                </option>

                <option value="ALL OTHER GREENLD. PORTS">
                  ALL OTHER GREENLD. PORTS
                </option>

                <option value="ALL OTHER GUINEA PORTS">
                  ALL OTHER GUINEA PORTS
                </option>

                <option value="ALL OTHER INDIA WEST COAST PTS">
                  ALL OTHER INDIA WEST COAST PTS
                </option>

                <option value="ALL OTHER INDONESIA PORTS">
                  ALL OTHER INDONESIA PORTS
                </option>

                <option value="ALL OTHER IVORY COAST PORTS">
                  ALL OTHER IVORY COAST PORTS
                </option>

                <option value="ALL OTHER JAPAN PORTS">
                  ALL OTHER JAPAN PORTS
                </option>

                <option value="ALL OTHER JAVA PORTS">
                  ALL OTHER JAVA PORTS
                </option>

                <option value="ALL OTHER JORDAN PORTS">
                  ALL OTHER JORDAN PORTS
                </option>

                <option value="ALL OTHER KALIMANTAN PORTS">
                  ALL OTHER KALIMANTAN PORTS
                </option>

                <option value="ALL OTHER KENYA PORTS">
                  ALL OTHER KENYA PORTS
                </option>

                <option value="ALL OTHER KUWAIT PORTS">
                  ALL OTHER KUWAIT PORTS
                </option>

                <option value="ALL OTHER LABRADOR PORTS">
                  ALL OTHER LABRADOR PORTS
                </option>

                <option value="ALL OTHER LATVIA PORTS">
                  ALL OTHER LATVIA PORTS
                </option>

                <option value="ALL OTHER LEBANON PORTS">
                  ALL OTHER LEBANON PORTS
                </option>

                <option value="ALL OTHER LITHUANIA PORTS">
                  ALL OTHER LITHUANIA PORTS
                </option>

                <option value="ALL OTHER MADAGASCAR PORTS">
                  ALL OTHER MADAGASCAR PORTS
                </option>

                <option value="ALL OTHER MALAYSIA PORTS">
                  ALL OTHER MALAYSIA PORTS
                </option>

                <option value="ALL OTHER MALTA PORTS">
                  ALL OTHER MALTA PORTS
                </option>

                <option value="ALL OTHER MAURITANIA PORTS">
                  ALL OTHER MAURITANIA PORTS
                </option>

                <option value="ALL OTHER MAURITIUS PORTS">
                  ALL OTHER MAURITIUS PORTS
                </option>

                <option value="ALL OTHER MOZAMBIQUE PORTS">
                  ALL OTHER MOZAMBIQUE PORTS
                </option>

                <option value="ALL OTHER MX W.CST REGN PT">
                  ALL OTHER MX W.CST REGN PT
                </option>

                <option value="ALL OTHER NAMIBIA PORTS">
                  ALL OTHER NAMIBIA PORTS
                </option>

                <option value="ALL OTHER NEW CALEDONIA PORTS">
                  ALL OTHER NEW CALEDONIA PORTS
                </option>

                <option value="ALL OTHER NEW ZEALAND PORTS">
                  ALL OTHER NEW ZEALAND PORTS
                </option>

                <option value="ALL OTHER NFLD. PORTS">
                  ALL OTHER NFLD. PORTS
                </option>

                <option value="ALL OTHER NIGERIA PORTS">
                  ALL OTHER NIGERIA PORTS
                </option>

                <option value="ALL OTHER NORWAY PORTS">
                  ALL OTHER NORWAY PORTS
                </option>

                <option value="ALL OTHER OMAN PORTS">
                  ALL OTHER OMAN PORTS
                </option>

                <option value="ALL OTHER PAKISTAN PORTS">
                  ALL OTHER PAKISTAN PORTS
                </option>

                <option value="ALL OTHER PAPUA NEW GUINEA PTS">
                  ALL OTHER PAPUA NEW GUINEA PTS
                </option>

                <option value="ALL OTHER PERU PORTS">
                  ALL OTHER PERU PORTS
                </option>

                <option value="ALL OTHER PHILIPPINES PORTS">
                  ALL OTHER PHILIPPINES PORTS
                </option>

                <option value="ALL OTHER POLAND PORTS">
                  ALL OTHER POLAND PORTS
                </option>

                <option value="ALL OTHER QATAR PORTS">
                  ALL OTHER QATAR PORTS
                </option>

                <option value="ALL OTHER ROMANIA PORTS">
                  ALL OTHER ROMANIA PORTS
                </option>

                <option value="ALL OTHER SARDINIA PORTS">
                  ALL OTHER SARDINIA PORTS
                </option>

                <option value="ALL OTHER SENEGAL PORTS">
                  ALL OTHER SENEGAL PORTS
                </option>

                <option value="ALL OTHER SEYCHELLES PORTS">
                  ALL OTHER SEYCHELLES PORTS
                </option>

                <option value="ALL OTHER SICILY PORTS">
                  ALL OTHER SICILY PORTS
                </option>

                <option value="ALL OTHER SIERRA LEONE PORTS">
                  ALL OTHER SIERRA LEONE PORTS
                </option>

                <option value="ALL OTHER SINGAPORE PORTS">
                  ALL OTHER SINGAPORE PORTS
                </option>

                <option value="ALL OTHER SLOVENIA PORTS">
                  ALL OTHER SLOVENIA PORTS
                </option>

                <option value="ALL OTHER SOUTH KOREA PORTS">
                  ALL OTHER SOUTH KOREA PORTS
                </option>

                <option value="ALL OTHER SRI LANKA PORTS">
                  ALL OTHER SRI LANKA PORTS
                </option>

                <option value="ALL OTHER SULAWESI PORTS">
                  ALL OTHER SULAWESI PORTS
                </option>

                <option value="ALL OTHER SUMATRA PORTS">
                  ALL OTHER SUMATRA PORTS
                </option>

                <option value="ALL OTHER TANZANIA PORTS">
                  ALL OTHER TANZANIA PORTS
                </option>

                <option value="ALL OTHER TASMANIA PORTS">
                  ALL OTHER TASMANIA PORTS
                </option>

                <option value="ALL OTHER TOGO PORTS">
                  ALL OTHER TOGO PORTS
                </option>

                <option value="ALL OTHER TUNISIA PORTS">
                  ALL OTHER TUNISIA PORTS
                </option>

                <option value="ALL OTHER URUGUAY PORTS">
                  ALL OTHER URUGUAY PORTS
                </option>

                <option value="ALL OTHER VIETNAM PORTS">
                  ALL OTHER VIETNAM PORTS
                </option>

                <option value="ALL OTHER VIRGIN ISLANDS PORTS">
                  ALL OTHER VIRGIN ISLANDS PORTS
                </option>

                <option value="ALL OTHER WALES PORTS">
                  ALL OTHER WALES PORTS
                </option>

                <option value="ALL OTHER WEST NEW GUINEA PORT">
                  ALL OTHER WEST NEW GUINEA PORT
                </option>

                <option value="ALL OTHER WESTERN SAHARA PORTS">
                  ALL OTHER WESTERN SAHARA PORTS
                </option>

                <option value="ALL OTHER YEMEN PORTS">
                  ALL OTHER YEMEN PORTS
                </option>

                <option value="ALL PORTS IN CAMBODIA">
                  ALL PORTS IN CAMBODIA
                </option>

                <option value="ALL SOLOMON ISLANDS PORTS">
                  ALL SOLOMON ISLANDS PORTS
                </option>

                <option value="ALL SOMALIA NORTHER REG. PORTS">
                  ALL SOMALIA NORTHER REG. PORTS
                </option>

                <option value="ALL ST. HELENA PORTS">
                  ALL ST. HELENA PORTS
                </option>

                <option value="ALL TONGA ISLANDS PORTS">
                  ALL TONGA ISLANDS PORTS
                </option>

                <option value="ALL WALLIS AND FUTUNA PORTS">
                  ALL WALLIS AND FUTUNA PORTS
                </option>

                <option value="ALLEPPEY, INDIA">ALLEPPEY, INDIA</option>

                <option value="ALLOTHER ST.CROIX,ST.CROIX VI">
                  ALLOTHER ST.CROIX,ST.CROIX VI
                </option>

                <option value="ALLOTHER,GRLKPORTS,GREENVILLE">
                  ALLOTHER,GRLKPORTS,GREENVILLE
                </option>

                <option value="ALLOTHERPORTS,SATTAHIPTHAILAND">
                  ALLOTHERPORTS,SATTAHIPTHAILAND
                </option>

                <option value="ALLUTH KALIMANTAN/KATAWARINGIN">
                  ALLUTH KALIMANTAN/KATAWARINGIN
                </option>

                <option value="ALMERIA, SPAIN">ALMERIA, SPAIN</option>

                <option value="ALMIRANTE, PAN.">ALMIRANTE, PAN.</option>

                <option value="ALOTAU, PAPUA NEW GUINEA">
                  ALOTAU, PAPUA NEW GUINEA
                </option>

                <option value="ALPHEN AAN DEN RIJN, NETHLDS">
                  ALPHEN AAN DEN RIJN, NETHLDS
                </option>

                <option value="ALTAMIRA">ALTAMIRA</option>

                <option value="ALTAMIRA, MEXICO">ALTAMIRA, MEXICO</option>

                <option value="ALTAMIRA, TAMPICO, PUERTO MADERO, MEX.">
                  ALTAMIRA, TAMPICO, PUERTO MADERO, MEX.
                </option>

                <option value="ALVARO OBR-FRONTERA,MEX.">
                  ALVARO OBR-FRONTERA,MEX.
                </option>

                <option value="AMAGASAKI, JAPAN">AMAGASAKI, JAPAN</option>

                <option value="AMAMAPARE, PAPUA NEW GUINEA">
                  AMAMAPARE, PAPUA NEW GUINEA
                </option>

                <option value="AMAPALA, HOND.">AMAPALA, HOND.</option>

                <option value="AMBARLI (ISTANBUL), TURKEY">
                  AMBARLI (ISTANBUL), TURKEY
                </option>

                <option value="AMBARLI ISTANBUL SEAPORT ">
                  AMBARLI ISTANBUL SEAPORT{" "}
                </option>

                <option value="AMBARLI PORT ,ISTANBUL IN TURKIYE ">
                  AMBARLI PORT ,ISTANBUL IN TURKIYE{" "}
                </option>

                <option value="AMBARLI PORT, ISTANBUL, TURKEY">
                  AMBARLI PORT, ISTANBUL, TURKEY
                </option>

                <option value="AMBARLI SEAPORT, ISTANBUL ">
                  AMBARLI SEAPORT, ISTANBUL{" "}
                </option>

                <option value="AMBARLI, ISTANBUL">AMBARLI, ISTANBUL</option>

                <option value="AMBARLI,ISTANBUL,TURKEY">
                  AMBARLI,ISTANBUL,TURKEY
                </option>

                <option value="AMHERSTBURG, ONT, CA.">
                  AMHERSTBURG, ONT, CA.
                </option>

                <option value="AMOY,XIAMEN:HSIA MEN, CHINA">
                  AMOY,XIAMEN:HSIA MEN, CHINA
                </option>

                <option value="AMPENAN; LEMBAR, JAVA">
                  AMPENAN; LEMBAR, JAVA
                </option>

                <option value="AMSTERDAM, NETHERLANDS">
                  AMSTERDAM, NETHERLANDS
                </option>

                <option value="AMUAY BAY, VENEZUELA">
                  AMUAY BAY, VENEZUELA
                </option>

                <option value="ANCON, PERU">ANCON, PERU</option>

                <option value="ANCONA SEAPORT IN EUROPE">
                  ANCONA SEAPORT IN EUROPE
                </option>

                <option value="ANCONA, ITALY">ANCONA, ITALY</option>

                <option value="ANDROS ISLAND, BAHAMAS">
                  ANDROS ISLAND, BAHAMAS
                </option>

                <option value="ANDROSSAN">ANDROSSAN</option>

                <option value="ANEWA BAY, PAPUA NEW GUINEA">
                  ANEWA BAY, PAPUA NEW GUINEA
                </option>

                <option value="ANGRA DOS REIS; TEBIG, BRAZIL">
                  ANGRA DOS REIS; TEBIG, BRAZIL
                </option>

                <option value="ANGUILLA, LEEWARD ISLANDS">
                  ANGUILLA, LEEWARD ISLANDS
                </option>

                <option value="ANTALYA">ANTALYA</option>

                <option value="ANTALYA; ATALIA; ADALIA, GREEC">
                  ANTALYA; ATALIA; ADALIA, GREEC
                </option>

                <option value="ANTAN TERMINAL, NIGERIA">
                  ANTAN TERMINAL, NIGERIA
                </option>

                <option value="ANTOFAGASTA, CHILE">ANTOFAGASTA, CHILE</option>

                <option value="ANTWERP">ANTWERP</option>

                <option value="ANTWERP PORT">ANTWERP PORT</option>

                <option value="ANTWERP SEAPORT">ANTWERP SEAPORT</option>

                <option value="ANTWERP, BELGIUM">ANTWERP, BELGIUM</option>

                <option value="ANTWERP. ANVERS, BELGIUM">
                  ANTWERP. ANVERS, BELGIUM
                </option>

                <option value="AOMORI,KUROISHI JAPAN">
                  AOMORI,KUROISHI JAPAN
                </option>

                <option value="APAPA SEAPORT LAGOS NIGERIA">
                  APAPA SEAPORT LAGOS NIGERIA
                </option>

                <option value="APAPA, NIGERIA">APAPA, NIGERIA</option>

                <option value="AQABA SEAPORT, JORDAN ">
                  AQABA SEAPORT, JORDAN{" "}
                </option>

                <option value="AQABA, JORDAN">AQABA, JORDAN</option>

                <option value="AQABA; AL AQABAH, JORDAN">
                  AQABA; AL AQABAH, JORDAN
                </option>

                <option value="ARATU, BRAZIL">ARATU, BRAZIL</option>

                <option value="ARAWAK CAY, BAHAMAS">ARAWAK CAY, BAHAMAS</option>

                <option value="ARGENTIA, NFLD">ARGENTIA, NFLD</option>

                <option value="ARICA, CHILE">ARICA, CHILE</option>

                <option value="ARJUNA TERMINAL, JAVA">
                  ARJUNA TERMINAL, JAVA
                </option>

                <option value="ARKLOW, IRELAND">ARKLOW, IRELAND</option>

                <option value="ARZANAH ISLAND, ARAB EMIRATES">
                  ARZANAH ISLAND, ARAB EMIRATES
                </option>

                <option value="ARZEW. ALGERIA">ARZEW. ALGERIA</option>

                <option value="ASHDOD, ISRAEL">ASHDOD, ISRAEL</option>

                <option value="ASPROPIRGOS; ASPROPYRGOS, GR.">
                  ASPROPIRGOS; ASPROPYRGOS, GR.
                </option>

                <option value="ASSAB; ASEB, ERITREA">
                  ASSAB; ASEB, ERITREA
                </option>

                <option value="ASUNCION SEAPORT, PARAGUAY">
                  ASUNCION SEAPORT, PARAGUAY
                </option>

                <option value="ASUNCION, PARAGUAY">ASUNCION, PARAGUAY</option>

                <option value="ATTAKA">ATTAKA</option>

                <option value="AUCKLAND, NEW ZEALAND">
                  AUCKLAND, NEW ZEALAND
                </option>

                <option value="AUGHINISH, IRELAND">AUGHINISH, IRELAND</option>

                <option value="AUGUSTA, ITALY">AUGUSTA, ITALY</option>

                <option value="AULDS COVE, NS,CA">AULDS COVE, NS,CA</option>

                <option value="AUX CAYES, HAITI">AUX CAYES, HAITI</option>

                <option value="AVATIU, RAROTONGA COOK ISLAND">
                  AVATIU, RAROTONGA COOK ISLAND
                </option>

                <option value="AVEIRO, PORTUGAL">AVEIRO, PORTUGAL</option>

                <option value="AVILES; SAN JUAN DE NIEVA, SP">
                  AVILES; SAN JUAN DE NIEVA, SP
                </option>

                <option value="AVONMOUTH, ENGLAND">AVONMOUTH, ENGLAND</option>

                <option value="AYIA MARINA, GREECE">AYIA MARINA, GREECE</option>

                <option value="AYIA TRIAS; MEGARA, GREECE">
                  AYIA TRIAS; MEGARA, GREECE
                </option>

                <option value="AYIOS NIKOLAOS; NIKOLA, GREECE">
                  AYIOS NIKOLAOS; NIKOLA, GREECE
                </option>

                <option value="BADDECK, CBI.  CA.">BADDECK, CBI. CA.</option>

                <option value="BAGNOLI, ITALY">BAGNOLI, ITALY</option>

                <option value="BAGUAL,ARGENTINA">BAGUAL,ARGENTINA</option>

                <option value="BAHIA BLANCA, ARG.">BAHIA BLANCA, ARG.</option>

                <option value="BAHIA DE CARAQUES, ECU">
                  BAHIA DE CARAQUES, ECU
                </option>

                <option value="BAHIA DE MOIN, COSTA RICA">
                  BAHIA DE MOIN, COSTA RICA
                </option>

                <option value="BAHRAIN">BAHRAIN</option>

                <option value="BAIS, PHILIPPINES">BAIS, PHILIPPINES</option>

                <option value="BAJO GRANDE, VENEZUELA">
                  BAJO GRANDE, VENEZUELA
                </option>

                <option value="BALAO; TEPRE, ECUADOR">
                  BALAO; TEPRE, ECUADOR
                </option>

                <option value="BALBOA PORT, ARICA">BALBOA PORT, ARICA</option>

                <option value="BALBOA, PAN.">BALBOA, PAN.</option>

                <option value="BALIKPAPAN, KALIMANTAN">
                  BALIKPAPAN, KALIMANTAN
                </option>

                <option value="BALONGAN TERMINAL, JAVA">
                  BALONGAN TERMINAL, JAVA
                </option>

                <option value="BANDIRMA; PANDERMA, TURKEY">
                  BANDIRMA; PANDERMA, TURKEY
                </option>

                <option value="BANGKOK">BANGKOK</option>

                <option value="BANGKOK (PAT),THAILAND">
                  BANGKOK (PAT),THAILAND
                </option>

                <option value="BANGKOK PORT">BANGKOK PORT</option>

                <option value="BANGKOK(BMTP),THAILAND">
                  BANGKOK(BMTP),THAILAND
                </option>

                <option value="BANGKOK, THAILAND">BANGKOK, THAILAND</option>

                <option value="BANGOR, NORTHERN IRELAND">
                  BANGOR, NORTHERN IRELAND
                </option>

                <option value="BANJARMASIN, INDONESIA">
                  BANJARMASIN, INDONESIA
                </option>

                <option value="BAR">BAR</option>

                <option value="BAR, YUGOSLAVIA">BAR, YUGOSLAVIA</option>

                <option value="BARAHONA, DOM. REP.">BARAHONA, DOM. REP.</option>

                <option value="BARAMA, BARAMANNI GUYANA">
                  BARAMA, BARAMANNI GUYANA
                </option>

                <option value="BARCADERA">BARCADERA</option>

                <option value="BARCELONA">BARCELONA</option>

                <option value="BARCELONA PORT,SPAIN">
                  BARCELONA PORT,SPAIN
                </option>

                <option value="BARCELONA, SPAIN">BARCELONA, SPAIN</option>

                <option value="BARI, ITALY">BARI, ITALY</option>

                <option value="BARLETTA, ITALY">BARLETTA, ITALY</option>

                <option value="BARRANQUILLA, COL.">BARRANQUILLA, COL.</option>

                <option value="BARREIRO, PORTUGAL">BARREIRO, PORTUGAL</option>

                <option value="BARRY, WALES">BARRY, WALES</option>

                <option value="BASSE TERRE, GUADELOUPE">
                  BASSE TERRE, GUADELOUPE
                </option>

                <option value="BASSENS, FRANCE">BASSENS, FRANCE</option>

                <option value="BASSETERRE, ST. KITTS">
                  BASSETERRE, ST. KITTS
                </option>

                <option value="BASUO; DONGFANG,  CHINA M">
                  BASUO; DONGFANG, CHINA M
                </option>

                <option value="BATAAN, PHILIPPINES">BATAAN, PHILIPPINES</option>

                <option value="BATANGAS, PHILIPPINES">
                  BATANGAS, PHILIPPINES
                </option>

                <option value="BATH, ONT, CA.">BATH, ONT, CA.</option>

                <option value="BATHURST, NB">BATHURST, NB</option>

                <option value="BATHURST; BANJUL, GAMBIA">
                  BATHURST; BANJUL, GAMBIA
                </option>

                <option value="BATUMI; BATUMIYSKAVA, GEORGIA">
                  BATUMI; BATUMIYSKAVA, GEORGIA
                </option>

                <option value="BAUAN, PHILIPPINES">BAUAN, PHILIPPINES</option>

                <option value="BAY ROBERTS, NFLD.  CA.">
                  BAY ROBERTS, NFLD. CA.
                </option>

                <option value="BAYONNE, FRANCE">BAYONNE, FRANCE</option>

                <option value="BAYSIDE, NB">BAYSIDE, NB</option>

                <option value="BEALE COVE, BC">BEALE COVE, BC</option>

                <option value="BEALE COVE, BC, CA.">BEALE COVE, BC, CA.</option>

                <option value="BEAUHARNOIS, QUE, CA.">
                  BEAUHARNOIS, QUE, CA.
                </option>

                <option value="BEAVER HARBOUR, NB.  CA.">
                  BEAVER HARBOUR, NB. CA.
                </option>

                <option value="BEC DAMBES; AMBES, FRANCE">
                  BEC DAMBES; AMBES, FRANCE
                </option>

                <option value="BECANCOUR, QUE.  CA.">
                  BECANCOUR, QUE. CA.
                </option>

                <option value="BEDI;JAMNAGAR;SIKKA,  INDIA">
                  BEDI;JAMNAGAR;SIKKA, INDIA
                </option>

                <option value="BEI HAI/BEIHAI;PAKHOI;PAKHO,CH">
                  BEI HAI/BEIHAI;PAKHOI;PAKHO,CH
                </option>

                <option value="BEI JAO, CHINA M">BEI JAO, CHINA M</option>

                <option value="BEILUN, CHINA M">BEILUN, CHINA M</option>

                <option value="BEIRA, MOZAMBIQUE">BEIRA, MOZAMBIQUE</option>

                <option value="BEIRUT">BEIRUT</option>

                <option value="BEIRUT; BEYROUTH, LEBANON">
                  BEIRUT; BEYROUTH, LEBANON
                </option>

                <option value="BEJAIA,ALGERIA">BEJAIA,ALGERIA</option>

                <option value="BELAWAN, INDONESIA">BELAWAN, INDONESIA</option>

                <option value="BELAWAN, SUMATRA">BELAWAN, SUMATRA</option>

                <option value="BELEM;PARA;VILADOCONDE,BARCARE">
                  BELEM;PARA;VILADOCONDE,BARCARE
                </option>

                <option value="BELFAST, IRELAND">BELFAST, IRELAND</option>

                <option value="BELFAST, NORTHERN IRELAND">
                  BELFAST, NORTHERN IRELAND
                </option>

                <option value="BELGROD-DNESTROVSKIY, UKRAINE">
                  BELGROD-DNESTROVSKIY, UKRAINE
                </option>

                <option value="BELILING; BULELENG, BALI">
                  BELILING; BULELENG, BALI
                </option>

                <option value="BELIZE">BELIZE</option>

                <option value="BELL BAY, TASMANIA, AUSTRAL">
                  BELL BAY, TASMANIA, AUSTRAL
                </option>

                <option value="BELLA COOLA, BC">BELLA COOLA, BC</option>

                <option value="BELLEDUNE, NB.  CA.">BELLEDUNE, NB. CA.</option>

                <option value="BENGKULU, SUMATRA">BENGKULU, SUMATRA</option>

                <option value="BENI SAF (BONE), ALGERIA">
                  BENI SAF (BONE), ALGERIA
                </option>

                <option value="BENOA, BALI">BENOA, BALI</option>

                <option value="BERBERA, SOMALIA">BERBERA, SOMALIA</option>

                <option value="BERDYANSK, UKRAINE">BERDYANSK, UKRAINE</option>

                <option value="BERGEN; AAGOTNES, NORWAY">
                  BERGEN; AAGOTNES, NORWAY
                </option>

                <option value="BERRE; ETANG DE BERRE, FRANCE">
                  BERRE; ETANG DE BERRE, FRANCE
                </option>

                <option value="BERWICK/BERWICK UPON TWEED, EN">
                  BERWICK/BERWICK UPON TWEED, EN
                </option>

                <option value="BEYPORE">BEYPORE</option>

                <option value="BHAVNAGAR, INDIA">BHAVNAGAR, INDIA</option>

                <option value="BIG CREEK, BELIZE">BIG CREEK, BELIZE</option>

                <option value="BILBAO, SPAIN">BILBAO, SPAIN</option>

                <option value="BIMA; BIMA TERMINAL, SUMATRA">
                  BIMA; BIMA TERMINAL, SUMATRA
                </option>

                <option value="BIMINI,GUN CAY,BAHAMAS">
                  BIMINI,GUN CAY,BAHAMAS
                </option>

                <option value="BINTULU, MALAYSIA">BINTULU, MALAYSIA</option>

                <option value="BIRKENHEAD, ENGLAND">BIRKENHEAD, ENGLAND</option>

                <option value="BISLIG, PHILIPPINES">BISLIG, PHILIPPINES</option>

                <option value="BITUNG, SULAWESI">BITUNG, SULAWESI</option>

                <option value="BIZERTE, TUNISIA">BIZERTE, TUNISIA</option>

                <option value="BJORNEBORG; PORI, FINLAND">
                  BJORNEBORG; PORI, FINLAND
                </option>

                <option value="BLACKS HARBOR, NB">BLACKS HARBOR, NB</option>

                <option value="BLAYE, FRANCE">BLAYE, FRANCE</option>

                <option value="BLUBBER BAY, BC, CA.">
                  BLUBBER BAY, BC, CA.
                </option>

                <option value="BLUEFIELDS, EL BLUFF, NICAR.">
                  BLUEFIELDS, EL BLUFF, NICAR.
                </option>

                <option value="BLUFF HARBOR NEW ZEALAND">
                  BLUFF HARBOR NEW ZEALAND
                </option>

                <option value="BOCA CHICA, DOM. REP.">
                  BOCA CHICA, DOM. REP.
                </option>

                <option value="BODO, NORWAY">BODO, NORWAY</option>

                <option value="BOMA, ZAIRE">BOMA, ZAIRE</option>

                <option value="BONAIRE ISLAND, NETHRLDS ANTIL">
                  BONAIRE ISLAND, NETHRLDS ANTIL
                </option>

                <option value="BONNY, NIGERIA">BONNY, NIGERIA</option>

                <option value="BONTANG; BONTANG BAY, SUMATRA">
                  BONTANG; BONTANG BAY, SUMATRA
                </option>

                <option value="BORDEAUX, FRANCE">BORDEAUX, FRANCE</option>

                <option value="BOTANY BAY, AUSTRALIA">
                  BOTANY BAY, AUSTRALIA
                </option>

                <option value="BOTLEK, NETHERLANDS">BOTLEK, NETHERLANDS</option>

                <option value="BOTWOOD, NFLD, CA.">BOTWOOD, NFLD, CA.</option>

                <option value="BOULOGNE, FRANCE">BOULOGNE, FRANCE</option>

                <option value="BOURGAS, BULGARIA">BOURGAS, BULGARIA</option>

                <option value="BOWMANVILLE, ONT.  CA.">
                  BOWMANVILLE, ONT. CA.
                </option>

                <option value="BRAEFOOT BAY, SCOTLAND">
                  BRAEFOOT BAY, SCOTLAND
                </option>

                <option value="BRAKE, FR GERMANY">BRAKE, FR GERMANY</option>

                <option value="BRASS TERMINAL; BRASS, NIGERIA">
                  BRASS TERMINAL; BRASS, NIGERIA
                </option>

                <option value="BREMEN, FR GERMANY">BREMEN, FR GERMANY</option>

                <option value="BREMERHAVEN ">BREMERHAVEN </option>

                <option value="BREMERHAVEN, EUROPEAN SEAPORT">
                  BREMERHAVEN, EUROPEAN SEAPORT
                </option>

                <option value="BREMERHAVEN,GERMANY">BREMERHAVEN,GERMANY</option>

                <option value="BREMERHAVEN; BERHN, FR GERMANY">
                  BREMERHAVEN; BERHN, FR GERMANY
                </option>

                <option value="BREST, FRANCE">BREST, FRANCE</option>

                <option value="BREVES,BRAZIL">BREVES,BRAZIL</option>

                <option value="BREVIK, NORWAY">BREVIK, NORWAY</option>

                <option value="BRIDGETOWN, BARBADOS">
                  BRIDGETOWN, BARBADOS
                </option>

                <option value="BRIDGEWATER, NS">BRIDGEWATER, NS</option>

                <option value="BRINDISI, ITALY">BRINDISI, ITALY</option>

                <option value="BRISBANE">BRISBANE</option>

                <option value="BRISBANE, AUSTRALIA">BRISBANE, AUSTRALIA</option>

                <option value="BRISTOL; BEBINGTON, ENGLAND">
                  BRISTOL; BEBINGTON, ENGLAND
                </option>

                <option value="BRITT, ONT">BRITT, ONT</option>

                <option value="BROCKVILLE, ONT, CA.">
                  BROCKVILLE, ONT, CA.
                </option>

                <option value="BROMSBOROUGH ENGLAND">
                  BROMSBOROUGH ENGLAND
                </option>

                <option value="BRUCE MINES,ONTARIO">BRUCE MINES,ONTARIO</option>

                <option value="BRUNSBUTTEL, FR GERMANY">
                  BRUNSBUTTEL, FR GERMANY
                </option>

                <option value="BRUSSELS; BRUXELLES, BELGIUM">
                  BRUSSELS; BRUXELLES, BELGIUM
                </option>

                <option value="BUDGE-BUDGE; BAJ-BAJ, INDIA">
                  BUDGE-BUDGE; BAJ-BAJ, INDIA
                </option>

                <option value="BUENAVENTURA">BUENAVENTURA</option>

                <option value="BUENAVENTURA - COLOMBIA ">
                  BUENAVENTURA - COLOMBIA{" "}
                </option>

                <option value="BUENAVENTURA, COL.">BUENAVENTURA, COL.</option>

                <option value="BUENAVENTURA, COLOMBIA ">
                  BUENAVENTURA, COLOMBIA{" "}
                </option>

                <option value="BUENOS AIRES">BUENOS AIRES</option>

                <option value="BUENOS AIRES, ARG.">BUENOS AIRES, ARG.</option>

                <option value="BUENOS AIRES, ARGENTINA">
                  BUENOS AIRES, ARGENTINA
                </option>

                <option value="BUKPYUNG,TONGHAE,REP OF KOREA">
                  BUKPYUNG,TONGHAE,REP OF KOREA
                </option>

                <option value="BUNBURY, AUS.">BUNBURY, AUS.</option>

                <option value="BUNDABERG, AUS.">BUNDABERG, AUS.</option>

                <option value="BURNABY, BC, CA">BURNABY, BC, CA</option>

                <option value="BURNIE, TASMANIA">BURNIE, TASMANIA</option>

                <option value="BUSAN PORT">BUSAN PORT</option>

                <option value="BUSAN PORT OF SOUTH KOREA">
                  BUSAN PORT OF SOUTH KOREA
                </option>

                <option value="BUSAN PORT, KOREA">BUSAN PORT, KOREA</option>

                <option value="BUSAN PORT, SOUTH KOREA">
                  BUSAN PORT, SOUTH KOREA
                </option>

                <option value="BUSAN SOUTH KOREA">BUSAN SOUTH KOREA</option>

                <option value="BUSAN, KOREA">BUSAN, KOREA</option>

                <option value="BUSAN, SOUTH KOREA">BUSAN, SOUTH KOREA</option>

                <option value="BUTTERWORTH,  MALAYSA">
                  BUTTERWORTH, MALAYSA
                </option>

                <option value="BUTUAN, PHILIPPINES">BUTUAN, PHILIPPINES</option>

                <option value="BUTZFLETH, FR GERMANY">
                  BUTZFLETH, FR GERMANY
                </option>

                <option value="CAACUPEMI ASUNCION">CAACUPEMI ASUNCION</option>

                <option value="CAACUPEMI ASUNCION, PARAGUAY">
                  CAACUPEMI ASUNCION, PARAGUAY
                </option>

                <option value="CABEDELO; JOAO PESSOA, BRAZIL">
                  CABEDELO; JOAO PESSOA, BRAZIL
                </option>

                <option value="CABINDA; TAKULA, ANGOLA">
                  CABINDA; TAKULA, ANGOLA
                </option>

                <option value="CABO ROJO, DOM. REP.">
                  CABO ROJO, DOM. REP.
                </option>

                <option value="CABO SAN LUCAS, MEX">CABO SAN LUCAS, MEX</option>

                <option value="CACOUNA, QUE CANADA">CACOUNA, QUE CANADA</option>

                <option value="CADIZ, SPAIN">CADIZ, SPAIN</option>

                <option value="CAEN, FRANCE">CAEN, FRANCE</option>

                <option value="CAGAYAN DE ORO; BUAYAN, PHIL.">
                  CAGAYAN DE ORO; BUAYAN, PHIL.
                </option>

                <option value="CAGLIARI, ITALY">CAGLIARI, ITALY</option>

                <option value="CALABAR, NIGERIA">CALABAR, NIGERIA</option>

                <option value="CALAIS, FRANCE">CALAIS, FRANCE</option>

                <option value="CALCUTTA, INDIA">CALCUTTA, INDIA</option>

                <option value="CALDERA BAY, DOM. REP.">
                  CALDERA BAY, DOM. REP.
                </option>

                <option value="CALDERA, CHILE">CALDERA, CHILE</option>

                <option value="CALDERA, COSTA RICA">CALDERA, COSTA RICA</option>

                <option value="CALETA OLIVIA(OLIVARES),ARGENT">
                  CALETA OLIVIA(OLIVARES),ARGENT
                </option>

                <option value="CALICA. MEXICO">CALICA. MEXICO</option>

                <option value="CALLAO PORT PERU">CALLAO PORT PERU</option>

                <option value="CALLAO, PERU">CALLAO, PERU</option>

                <option value="CAM RANH BAY, VIETNAM">
                  CAM RANH BAY, VIETNAM
                </option>

                <option value="CAMPANA, ARG.">CAMPANA, ARG.</option>

                <option value="CAMPBELL RIVER, BC">CAMPBELL RIVER, BC</option>

                <option value="CAMPBELLTON, NB, CA.">
                  CAMPBELLTON, NB, CA.
                </option>

                <option value="CAMPECHE, MEX.">CAMPECHE, MEX.</option>

                <option value="CAMPOBELLO, NB, CA.">CAMPOBELLO, NB, CA.</option>

                <option value="CANCUN, MEXICO">CANCUN, MEXICO</option>

                <option value="CANNES, FRANCE">CANNES, FRANCE</option>

                <option value="CAP HAITIEN, HAITI">CAP HAITIEN, HAITI</option>

                <option value="CAPE LOPEZ, GABON">CAPE LOPEZ, GABON</option>

                <option value="CAPE TOWN">CAPE TOWN</option>

                <option value="CAPE TOWN, REP. OF S.AFR">
                  CAPE TOWN, REP. OF S.AFR
                </option>

                <option value="CAPE TOWN, SOUTH AFRICA">
                  CAPE TOWN, SOUTH AFRICA
                </option>

                <option value="CARACAS; LA GUAIRA, VENEZUELA">
                  CARACAS; LA GUAIRA, VENEZUELA
                </option>

                <option value="CARBONEAR, NFLD">CARBONEAR, NFLD</option>

                <option value="CARBONERAS, SPAIN">CARBONERAS, SPAIN</option>

                <option value="CARDIFF, WALES">CARDIFF, WALES</option>

                <option value="CARDINAL, ONT, CA.">CARDINAL, ONT, CA.</option>

                <option value="CARIPITO, VENEZUELA">CARIPITO, VENEZUELA</option>

                <option value="CARMEN, MEX.">CARMEN, MEX.</option>

                <option value="CARTAGENA">CARTAGENA</option>

                <option value="CARTAGENA COLOMBIA">CARTAGENA COLOMBIA</option>

                <option value="CARTAGENA, COLOMBIA">CARTAGENA, COLOMBIA</option>

                <option value="CARTAGENA, SPAIN">CARTAGENA, SPAIN</option>

                <option value="CARUPANO, VENEZUELA">CARUPANO, VENEZUELA</option>

                <option value="CASABLANCA ">CASABLANCA </option>

                <option value="CASABLANCA PORT">CASABLANCA PORT</option>

                <option value="CASABLANCA PORT, MOROCCO">
                  CASABLANCA PORT, MOROCCO
                </option>

                <option value="CASABLANCA, MOROCCO">CASABLANCA, MOROCCO</option>

                <option value="CASTAWAY CAY, BAHAMAS">
                  CASTAWAY CAY, BAHAMAS
                </option>

                <option value="CASTELLON, SPAIN">CASTELLON, SPAIN</option>

                <option value="CASTRIES, ST. LUCIA">CASTRIES, ST. LUCIA</option>

                <option value="CAT CAY, BAHAMAS, BAHAMAS">
                  CAT CAY, BAHAMAS, BAHAMAS
                </option>

                <option value="CAT ISLAND, BAHAMAS">CAT ISLAND, BAHAMAS</option>

                <option value="CATANIA">CATANIA</option>

                <option value="CATINIA, ITALY">CATINIA, ITALY</option>

                <option value="CAUCEDO">CAUCEDO</option>

                <option value="CAUCEDO, DOMINICAN REPUBLIC">
                  CAUCEDO, DOMINICAN REPUBLIC
                </option>

                <option value="CAYMAN BRAC, CAYMAN">CAYMAN BRAC, CAYMAN</option>

                <option value="CAYO ARCAS TERMINAL, MEX.">
                  CAYO ARCAS TERMINAL, MEX.
                </option>

                <option value="CEBU">CEBU</option>

                <option value="CEBU; SANGI, PHILIPPINES">
                  CEBU; SANGI, PHILIPPINES
                </option>

                <option value="CERROS ISL, CEDROS, MEX.">
                  CERROS ISL, CEDROS, MEX.
                </option>

                <option value="CEUTA, SPAIN">CEUTA, SPAIN</option>

                <option value="CHANARAL;CALETA BARQUITO,CHILE">
                  CHANARAL;CALETA BARQUITO,CHILE
                </option>

                <option value="CHANDLER, QUE, CA.">CHANDLER, QUE, CA.</option>

                <option value="CHARLESTOWN, NEVIS ISLAND">
                  CHARLESTOWN, NEVIS ISLAND
                </option>

                <option value="CHARLOTTE AMALIE/ST THO,VIR IS">
                  CHARLOTTE AMALIE/ST THO,VIR IS
                </option>

                <option value="CHARLOTTETOWN, PEI">CHARLOTTETOWN, PEI</option>

                <option value="CHATHAM, NB">CHATHAM, NB</option>

                <option value="CHATTOGRAM SEAPORT ">CHATTOGRAM SEAPORT </option>

                <option value="CHATTOGRAM SEAPORT, BANGLADESH">
                  CHATTOGRAM SEAPORT, BANGLADESH
                </option>

                <option value="CHATTOGRAM, BANGLADESH">
                  CHATTOGRAM, BANGLADESH
                </option>

                <option value="CHEFOO/YANTAI/YENTAI, CHINA M">
                  CHEFOO/YANTAI/YENTAI, CHINA M
                </option>

                <option value="CHEN HAI; JINHAE, REP OF KOREA">
                  CHEN HAI; JINHAE, REP OF KOREA
                </option>

                <option value="CHENNAI">CHENNAI</option>

                <option value="CHENNAI PORT, INDIA ">
                  CHENNAI PORT, INDIA{" "}
                </option>

                <option value="CHENNAI SEA PORT, INDIA">
                  CHENNAI SEA PORT, INDIA
                </option>

                <option value="CHENNAI SEA, INDIA">CHENNAI SEA, INDIA</option>

                <option value="CHENNAI SEAPORT , INDIA">
                  CHENNAI SEAPORT , INDIA
                </option>

                <option value="CHENNAI, INDIA">CHENNAI, INDIA</option>

                <option value="CHERBOURG, FRANCE">CHERBOURG, FRANCE</option>

                <option value="CHETUMAL; MAHAHUAL, MEXICO">
                  CHETUMAL; MAHAHUAL, MEXICO
                </option>

                <option value="CHIBA; CHIBAKO, JAPAN">
                  CHIBA; CHIBAKO, JAPAN
                </option>

                <option value="CHICOUTIMI, QUE, CA.">
                  CHICOUTIMI, QUE, CA.
                </option>

                <option value="CHIN WANG TAO, CHINA M">
                  CHIN WANG TAO, CHINA M
                </option>

                <option value="CHIOGGIA, ITALY">CHIOGGIA, ITALY</option>

                <option value="CHIOS, GREECE">CHIOS, GREECE</option>

                <option value="CHIRIQUI GRANDE TERM, PAN.">
                  CHIRIQUI GRANDE TERM, PAN.
                </option>

                <option value="CHITTAGONG">CHITTAGONG</option>

                <option value="CHITTAGONG, BANGLADESH">
                  CHITTAGONG, BANGLADESH
                </option>

                <option value="CHIWAN">CHIWAN</option>

                <option value="CHIWAN, CHINA">CHIWAN, CHINA</option>

                <option value="CHIWAN, CHINA M">CHIWAN, CHINA M</option>

                <option value="CHONGQING ">CHONGQING </option>

                <option value="CHRISTCHURCH NEW ZEALAND">
                  CHRISTCHURCH NEW ZEALAND
                </option>

                <option value="CHRISTIANSTED, VIRGIN ISLAND">
                  CHRISTIANSTED, VIRGIN ISLAND
                </option>

                <option value="CHRISTMAS ISLAND">CHRISTMAS ISLAND</option>

                <option value="CHRISTMAS ISLAND, KIRIBAT">
                  CHRISTMAS ISLAND, KIRIBAT
                </option>

                <option value="CHUB CAY, BAHAMAS">CHUB CAY, BAHAMAS</option>

                <option value="CHURCHILL, MAN">CHURCHILL, MAN</option>

                <option value="CIGADING, INDONESIA">CIGADING, INDONESIA</option>

                <option value="CILACAP; TJILATJAP, JAVA">
                  CILACAP; TJILATJAP, JAVA
                </option>

                <option value="CINTA TERMINAL, JAVA">
                  CINTA TERMINAL, JAVA
                </option>

                <option value="CIUDAD BOLIVAR, VENEZUELA">
                  CIUDAD BOLIVAR, VENEZUELA
                </option>

                <option value="CIVITAVECCHIA, ITALY">
                  CIVITAVECCHIA, ITALY
                </option>

                <option value="CLARENCE RIVER, YAMBA, AUSTRAL">
                  CLARENCE RIVER, YAMBA, AUSTRAL
                </option>

                <option value="CLARENCE TOWN,LONG ISL, BAHAMA">
                  CLARENCE TOWN,LONG ISL, BAHAMA
                </option>

                <option value="CLARENVILLE, NFLD, CA.">
                  CLARENVILLE, NFLD, CA.
                </option>

                <option value="CLARKE CITY, QUE, CA.">
                  CLARKE CITY, QUE, CA.
                </option>

                <option value="CLARKES HARBOUR, NS">CLARKES HARBOUR, NS</option>

                <option value="CLARKSON, ONT, CA.">CLARKSON, ONT, CA.</option>

                <option value="CLIFTON POINT, BAHAMAS">
                  CLIFTON POINT, BAHAMAS
                </option>

                <option value="CLIPPERTON ISLAND">CLIPPERTON ISLAND</option>

                <option value="CLYDE, SCOTLAND">CLYDE, SCOTLAND</option>

                <option value="COCHIN, INDIA">COCHIN, INDIA</option>

                <option value="COCKBURN HARBOR,CAICOS ISLAND">
                  COCKBURN HARBOR,CAICOS ISLAND
                </option>

                <option value="COCO SOLO, PANAMA">COCO SOLO, PANAMA</option>

                <option value="COLEYS PT., NFLD CANADA">
                  COLEYS PT., NFLD CANADA
                </option>

                <option value="COLOMBO">COLOMBO</option>

                <option value="COLOMBO, SRI LANKA ">COLOMBO, SRI LANKA </option>

                <option value="COLOMBO, SRI LANKA (CEYLON)">
                  COLOMBO, SRI LANKA (CEYLON)
                </option>

                <option value="COLON FREE ZONE ">COLON FREE ZONE </option>

                <option value="COLON FREE ZONE, PANAMA">
                  COLON FREE ZONE, PANAMA
                </option>

                <option value="COLORADO BAR, COSTA RICA">
                  COLORADO BAR, COSTA RICA
                </option>

                <option value="COME-BY-CHANCE, NFLD, CA">
                  COME-BY-CHANCE, NFLD, CA
                </option>

                <option value="COMEAU BAY, QUE, CA.">
                  COMEAU BAY, QUE, CA.
                </option>

                <option value="COMODORO RIVADAVIA, ARGENTINA">
                  COMODORO RIVADAVIA, ARGENTINA
                </option>

                <option value="CONAKRY: KONAKRI, GUINEA">
                  CONAKRY: KONAKRI, GUINEA
                </option>

                <option value="CONCEPTION BAY, NFLD CANADA">
                  CONCEPTION BAY, NFLD CANADA
                </option>

                <option value="CONCHAN, PERU">CONCHAN, PERU</option>

                <option value="CONSTANTA, ROMANIA">CONSTANTA, ROMANIA</option>

                <option value="CONSTANTA; CONSTANTZA, ROMANIA">
                  CONSTANTA; CONSTANTZA, ROMANIA
                </option>

                <option value="CONTRECOEUR, QUE, CA.">
                  CONTRECOEUR, QUE, CA.
                </option>

                <option value="COPENHAGEN, DENMARK">COPENHAGEN, DENMARK</option>

                <option value="COPENHAGEN; KOBENHAVN, DENMARK">
                  COPENHAGEN; KOBENHAVN, DENMARK
                </option>

                <option value="COQUIMBO, CHILE">COQUIMBO, CHILE</option>

                <option value="CORFU, GREECE">CORFU, GREECE</option>

                <option value="CORINTH; KORINTHOS, GREECE">
                  CORINTH; KORINTHOS, GREECE
                </option>

                <option value="CORINTO ">CORINTO </option>

                <option value="CORINTO, NICAR.">CORINTO, NICAR.</option>

                <option value="CORK">CORK</option>

                <option value="CORK; COBN, IRELAND">CORK; COBN, IRELAND</option>

                <option value="CORNER BROOK, NFLD, CA.">
                  CORNER BROOK, NFLD, CA.
                </option>

                <option value="CORNWALL, ONT, CA.">CORNWALL, ONT, CA.</option>

                <option value="CORO, VENEZUELA">CORO, VENEZUELA</option>

                <option value="CORONEL, CHILE ">CORONEL, CHILE </option>

                <option value="CORUNNA, ONT, CA.">CORUNNA, ONT, CA.</option>

                <option value="COTONOU PORT - BENIN">
                  COTONOU PORT - BENIN
                </option>

                <option value="COTONOU, BENIN">COTONOU, BENIN</option>

                <option value="COVENAS, COLUMBIA">COVENAS, COLUMBIA</option>

                <option value="COWICHAN, B.C., CA.">COWICHAN, B.C., CA.</option>

                <option value="COZUMEL ISLAND,PUNTA VENADO,MX">
                  COZUMEL ISLAND,PUNTA VENADO,MX
                </option>

                <option value="CRISTOBAL, PAN.">CRISTOBAL, PAN.</option>

                <option value="CROFTON, BC, CA.">CROFTON, BC, CA.</option>

                <option value="CROTONE; MANFREDONIA, ITALY">
                  CROTONE; MANFREDONIA, ITALY
                </option>

                <option value="CRUZ BAY, ST. JOHN ISLAND">
                  CRUZ BAY, ST. JOHN ISLAND
                </option>

                <option value="CTRIGHT;LAMPTON,LAMBTON, ONT">
                  CTRIGHT;LAMPTON,LAMBTON, ONT
                </option>

                <option value="CUL DE SAC, ST. LUCIA">
                  CUL DE SAC, ST. LUCIA
                </option>

                <option value="CUMAREBO, VENEZUELA">CUMAREBO, VENEZUELA</option>

                <option value="CURACAO ISLAND, NETHRLD ANTIL">
                  CURACAO ISLAND, NETHRLD ANTIL
                </option>

                <option value="CUXHAVEN, FR GERMANY">
                  CUXHAVEN, FR GERMANY
                </option>

                <option value="DA CHAN BAY, CHINA">DA CHAN BAY, CHINA</option>

                <option value="DA NANG, VIETNAM">DA NANG, VIETNAM</option>

                <option value="DA NANG; TOURANE, VIET NAM">
                  DA NANG; TOURANE, VIET NAM
                </option>

                <option value="DADIANGAS; GENERAL SANTOS, PHL">
                  DADIANGAS; GENERAL SANTOS, PHL
                </option>

                <option value="DAESAN, REP OF KOREA">
                  DAESAN, REP OF KOREA
                </option>

                <option value="DAGENHAM, ENGLAND">DAGENHAM, ENGLAND</option>

                <option value="DAIREN; DALIAN; LUDA, CHINA M">
                  DAIREN; DALIAN; LUDA, CHINA M
                </option>

                <option value="DAKAR (SENEGAL) ">DAKAR (SENEGAL) </option>

                <option value="DAKAR, SENEGAL">DAKAR, SENEGAL</option>

                <option value="DALHOUSIE, NB, CA.">DALHOUSIE, NB, CA.</option>

                <option value="DALIAN">DALIAN</option>

                <option value="DALRYMPLE BAY; HAY POINT, AUST">
                  DALRYMPLE BAY; HAY POINT, AUST
                </option>

                <option value="DAMIETTA SEAPORT, EGYPT">
                  DAMIETTA SEAPORT, EGYPT
                </option>

                <option value="DAMIETTA, EGYPT">DAMIETTA, EGYPT</option>

                <option value="DAMMAM SEAPORT">DAMMAM SEAPORT</option>

                <option value="DAMMAM, SAUDI ARABIA">
                  DAMMAM, SAUDI ARABIA
                </option>

                <option value="DAMPIER, AUS.">DAMPIER, AUS.</option>

                <option value="DAR ES SALAAM, TANZANIA">
                  DAR ES SALAAM, TANZANIA
                </option>

                <option value="DARCIA, TURKEY">DARCIA, TURKEY</option>

                <option value="DARTMOUTH, NS, CA.">DARTMOUTH, NS, CA.</option>

                <option value="DARWIN, AUSTRAL">DARWIN, AUSTRAL</option>

                <option value="DAS; DAS ISLAND, ARAB EMIRATES">
                  DAS; DAS ISLAND, ARAB EMIRATES
                </option>

                <option value="DAVAO, PHILIPPINES">DAVAO, PHILIPPINES</option>

                <option value="DEER ISLAND CANADA">DEER ISLAND CANADA</option>

                <option value="DEGRAD DES CANNES, FRENCH GUIA">
                  DEGRAD DES CANNES, FRENCH GUIA
                </option>

                <option value="DEKHEILA ALEXANDRIA">DEKHEILA ALEXANDRIA</option>

                <option value="DELFZIJL, NETHERLANDS">
                  DELFZIJL, NETHERLANDS
                </option>

                <option value="DELTA, BC, CA">DELTA, BC, CA</option>

                <option value="DEPOT HARBOR, ONT, CA.">
                  DEPOT HARBOR, ONT, CA.
                </option>

                <option value="DERINCE; DERINDJE, TURKEY">
                  DERINCE; DERINDJE, TURKEY
                </option>

                <option value="DHAHRAN, SAUDI ARABIA">
                  DHAHRAN, SAUDI ARABIA
                </option>

                <option value="DHUBA/YAMBO/KING FAHD PT. S AR">
                  DHUBA/YAMBO/KING FAHD PT. S AR
                </option>

                <option value="DIEGO GARCIA, BRIT INDN OCEAN">
                  DIEGO GARCIA, BRIT INDN OCEAN
                </option>

                <option value="DIEPPE, FRANCE">DIEPPE, FRANCE</option>

                <option value="DIGBY, PRT DIGBY, NS CANADA">
                  DIGBY, PRT DIGBY, NS CANADA
                </option>

                <option value="DIKILI, TURKEY">DIKILI, TURKEY</option>

                <option value="DJAKARTA; TANJUNG PRIOK, JAVA">
                  DJAKARTA; TANJUNG PRIOK, JAVA
                </option>

                <option value="DJIBOUTI, DJIBOUTI">DJIBOUTI, DJIBOUTI</option>

                <option value="DOHA, QATAR">DOHA, QATAR</option>

                <option value="DONGES, FRANCE">DONGES, FRANCE</option>

                <option value="DONGGUAN, CHINA">DONGGUAN, CHINA</option>

                <option value="DONNACONA, QUE, CA.">DONNACONA, QUE, CA.</option>

                <option value="DORDRECHT, NETHERLANDS">
                  DORDRECHT, NETHERLANDS
                </option>

                <option value="DOS BOCAS, MEX.">DOS BOCAS, MEX.</option>

                <option value="DOUALA PORT, CAMEROON">
                  DOUALA PORT, CAMEROON
                </option>

                <option value="DOVER, UNITED KINGDOM">
                  DOVER, UNITED KINGDOM
                </option>

                <option value="DRAMMEN, NORWAY">DRAMMEN, NORWAY</option>

                <option value="DROGHEDA, IRELAND">DROGHEDA, IRELAND</option>

                <option value="DUBAI">DUBAI</option>

                <option value="DUBAI PORT,U.A.E.">DUBAI PORT,U.A.E.</option>

                <option value="DUBAI UAE">DUBAI UAE</option>

                <option value="DUBAYY;DUBAI;PT RASHID, ARAB EM">
                  DUBAYY;DUBAI;PT RASHID, ARAB EM
                </option>

                <option value="DUBLIN">DUBLIN</option>

                <option value="DUBLIN, IRELAND">DUBLIN, IRELAND</option>

                <option value="DUBROVNIK; RAGUSA, CROATIA">
                  DUBROVNIK; RAGUSA, CROATIA
                </option>

                <option value="DUGI RAT, CROATIA">DUGI RAT, CROATIA</option>

                <option value="DUMAGUETE, PHILIPPINES">
                  DUMAGUETE, PHILIPPINES
                </option>

                <option value="DUMAI, SUMATRA">DUMAI, SUMATRA</option>

                <option value="DUNCAN (DUNCAN BAY) BC.">
                  DUNCAN (DUNCAN BAY) BC.
                </option>

                <option value="DUNDEE, SCOTLAND">DUNDEE, SCOTLAND</option>

                <option value="DUNEDIN; OTAGO HARBOR, NEW ZEA">
                  DUNEDIN; OTAGO HARBOR, NEW ZEA
                </option>

                <option value="DUNKERQUE; DUNKIRK, FRANCE">
                  DUNKERQUE; DUNKIRK, FRANCE
                </option>

                <option value="DURBAN">DURBAN</option>

                <option value="DURBAN, SOUTH AFRICA">
                  DURBAN, SOUTH AFRICA
                </option>

                <option value="DURBAN,REP.OF SO.AFRICA">
                  DURBAN,REP.OF SO.AFRICA
                </option>

                <option value="DURRES; DURAZZO, ALBANIA">
                  DURRES; DURAZZO, ALBANIA
                </option>

                <option value="EARLS ISLAND, NFLD, CA.">
                  EARLS ISLAND, NFLD, CA.
                </option>

                <option value="EAST LONDON, REP.SO.AFR.">
                  EAST LONDON, REP.SO.AFR.
                </option>

                <option value="EAST ZEIT BAY TERMINAL, EGYPT">
                  EAST ZEIT BAY TERMINAL, EGYPT
                </option>

                <option value="EASTHAM,  ENGLAND">EASTHAM, ENGLAND</option>

                <option value="EBEYE, ALL OTHER MARSHALLISL.">
                  EBEYE, ALL OTHER MARSHALLISL.
                </option>

                <option value="EDINBURG; LEITH, SCOTLAND">
                  EDINBURG; LEITH, SCOTLAND
                </option>

                <option value="EEMSHAVEN, NETHLDS">EEMSHAVEN, NETHLDS</option>

                <option value="EGERSUND,  NORWAY">EGERSUND, NORWAY</option>

                <option value="EINSWARDEN, FR GERMANY">
                  EINSWARDEN, FR GERMANY
                </option>

                <option value="EL CHAURE, VENEZUELA">
                  EL CHAURE, VENEZUELA
                </option>

                <option value="EL DEKHEILA">EL DEKHEILA</option>

                <option value="EL GUAMACHE">EL GUAMACHE</option>

                <option value="EL HAMRA/ALAMEIN/MERSA, EGYPT">
                  EL HAMRA/ALAMEIN/MERSA, EGYPT
                </option>

                <option value="EL ISMAILIYA, EGYPT">EL ISMAILIYA, EGYPT</option>

                <option value="EL JORF LASFAR, MOROCCO">
                  EL JORF LASFAR, MOROCCO
                </option>

                <option value="EL PALITO, VENEZUELA">
                  EL PALITO, VENEZUELA
                </option>

                <option value="EL SAUZAL, SAUZAL, MEXICO">
                  EL SAUZAL, SAUZAL, MEXICO
                </option>

                <option value="EL TABLAZO, VENEZUELA">
                  EL TABLAZO, VENEZUELA
                </option>

                <option value="ELAT; EILATH; EILAT, ISRAEL">
                  ELAT; EILATH; EILAT, ISRAEL
                </option>

                <option value="ELEFSIS; ELEUSIS, GREECE">
                  ELEFSIS; ELEUSIS, GREECE
                </option>

                <option value="ELEUTHERAISL,HASRBORISL,BAHAMA">
                  ELEUTHERAISL,HASRBORISL,BAHAMA
                </option>

                <option value="ELK FALLS, BC.  CA.">ELK FALLS, BC. CA.</option>

                <option value="ELLESMERE; STANLOW, ENGLAND">
                  ELLESMERE; STANLOW, ENGLAND
                </option>

                <option value="ELSFLETH, GERMANY">ELSFLETH, GERMANY</option>

                <option value="EMDEN, FR GERMANY">EMDEN, FR GERMANY</option>

                <option value="ENGLEE HARBOR, NFLD">ENGLEE HARBOR, NFLD</option>

                <option value="ENGLISH HARBOR, KIRIBAT">
                  ENGLISH HARBOR, KIRIBAT
                </option>

                <option value="ENNORE PORT - INDIA ">
                  ENNORE PORT - INDIA{" "}
                </option>

                <option value="ENNORE, INDIA">ENNORE, INDIA</option>

                <option value="ENSENADA, MEX.">ENSENADA, MEX.</option>

                <option value="ENSTEAD/ENSTEADVAERKET, DEN.">
                  ENSTEAD/ENSTEADVAERKET, DEN.
                </option>

                <option value="EREGLI; UZUNKUM, TURKEY">
                  EREGLI; UZUNKUM, TURKEY
                </option>

                <option value="ERITH,  ENGLAND">ERITH, ENGLAND</option>

                <option value="ESBJERG, DENMARK">ESBJERG, DENMARK</option>

                <option value="ESCRAVOS OIL TERMINAL, NIGERIA">
                  ESCRAVOS OIL TERMINAL, NIGERIA
                </option>

                <option value="ESMERALDAS, ECU.">ESMERALDAS, ECU.</option>

                <option value="ESPERANCE, AUSTRALIA">
                  ESPERANCE, AUSTRALIA
                </option>

                <option value="EUROPOORT, NETHERLANDS">
                  EUROPOORT, NETHERLANDS
                </option>

                <option value="EVERTON, GUYANA">EVERTON, GUYANA</option>

                <option value="EVYAP PORT, TURKEY">EVYAP PORT, TURKEY</option>

                <option value="EXUMA, BAHAMAS">EXUMA, BAHAMAS</option>

                <option value="EYDEHAMN, NORWAY">EYDEHAMN, NORWAY</option>

                <option value="FALKENBERG, SWEDEN">FALKENBERG, SWEDEN</option>

                <option value="FALMOUTH, ENGLAND">FALMOUTH, ENGLAND</option>

                <option value="FANG CHENG; FANGCHENG, CHINA M">
                  FANG CHENG; FANGCHENG, CHINA M
                </option>

                <option value="FANNING, ISLAND">FANNING, ISLAND</option>

                <option value="FARSUND,  NORWAY">FARSUND, NORWAY</option>

                <option value="FATEH TERMINAL, ARAB EMIRATES">
                  FATEH TERMINAL, ARAB EMIRATES
                </option>

                <option value="FAWLEY, ENGLAND">FAWLEY, ENGLAND</option>

                <option value="FELIXSTOWE, ENGLAND">FELIXSTOWE, ENGLAND</option>

                <option value="FELIXSTOWE, U.K.">FELIXSTOWE, U.K.</option>

                <option value="FERROL, SPAIN">FERROL, SPAIN</option>

                <option value="FIGUEIRA DA FOZ, PORTUGAL">
                  FIGUEIRA DA FOZ, PORTUGAL
                </option>

                <option value="FISHER HARBOUR, BC">FISHER HARBOUR, BC</option>

                <option value="FLORO, NORWAY">FLORO, NORWAY</option>

                <option value="FLOTTA, SCOTLAND">FLOTTA, SCOTLAND</option>

                <option value="FORCADOS TERMINAL; FORCADOS,NG">
                  FORCADOS TERMINAL; FORCADOS,NG
                </option>

                <option value="FOREIGN TRADE ZONE IN USA">
                  FOREIGN TRADE ZONE IN USA
                </option>

                <option value="FORT BAY; FORT BAII, ARUBA">
                  FORT BAY; FORT BAII, ARUBA
                </option>

                <option value="FORT DE FRANCE, MARTINIQUE">
                  FORT DE FRANCE, MARTINIQUE
                </option>

                <option value="FORT LIBERTE, HAITI">FORT LIBERTE, HAITI</option>

                <option value="FORTALEZA;CEARA;MUCURIPE,BRAZ">
                  FORTALEZA;CEARA;MUCURIPE,BRAZ
                </option>

                <option value="FORTUNE, NFLD">FORTUNE, NFLD</option>

                <option value="FOS SUR MER; FOS, FRANCE">
                  FOS SUR MER; FOS, FRANCE
                </option>

                <option value="FOWEY, ENGLAND">FOWEY, ENGLAND</option>

                <option value="FOYNES, IRELAND">FOYNES, IRELAND</option>

                <option value="FRASER RIVER, BC, CA.">
                  FRASER RIVER, BC, CA.
                </option>

                <option value="FREDERICIA, DENMARK">FREDERICIA, DENMARK</option>

                <option value="FREDERIKSHAVN, DENMARK">
                  FREDERIKSHAVN, DENMARK
                </option>

                <option value="FREDERIKSTED, VIRGIN ISLANDS">
                  FREDERIKSTED, VIRGIN ISLANDS
                </option>

                <option value="FREDRIKSTAD, NORWAY">FREDRIKSTAD, NORWAY</option>

                <option value="FREEPORT AND ALL OF GRAND BAHAMA ISLAND">
                  FREEPORT AND ALL OF GRAND BAHAMA ISLAND
                </option>

                <option value="FREETOWN, SIERRA LEONE">
                  FREETOWN, SIERRA LEONE
                </option>

                <option value="FREMANTLE">FREMANTLE</option>

                <option value="FREMANTLE, AUSTRALIA">
                  FREMANTLE, AUSTRALIA
                </option>

                <option value="FRESHCREEK;ALLOTHERBAHAMASPORT">
                  FRESHCREEK;ALLOTHERBAHAMASPORT
                </option>

                <option value="FUJAIRAH, ARAB EM">FUJAIRAH, ARAB EM</option>

                <option value="FUKUYAMA, JAPAN">FUKUYAMA, JAPAN</option>

                <option value="FUNABASHI, JAPAN">FUNABASHI, JAPAN</option>

                <option value="FUNAFUTI, ISLAND">FUNAFUTI, ISLAND</option>

                <option value="FUNAGAWA, JAPAN">FUNAGAWA, JAPAN</option>

                <option value="FUNCHAL, PORTUGAL">FUNCHAL, PORTUGAL</option>

                <option value="FUSHIKI; FUSHIKITOYAMA, JAPAN">
                  FUSHIKI; FUSHIKITOYAMA, JAPAN
                </option>

                <option value="FUZHOU">FUZHOU</option>

                <option value="FUZHOU, CHINA">FUZHOU, CHINA</option>

                <option value="FUZHOU; FUCHOU; FOOCHOU; CHINA">
                  FUZHOU; FUCHOU; FOOCHOU; CHINA
                </option>

                <option value="GABES, TUNISIA">GABES, TUNISIA</option>

                <option value="GADDVIK, SWEDEN">GADDVIK, SWEDEN</option>

                <option value="GAETA, ITALY">GAETA, ITALY</option>

                <option value="GALEOTA POINT, TRINIDAD">
                  GALEOTA POINT, TRINIDAD
                </option>

                <option value="GAMBA, GABON">GAMBA, GABON</option>

                <option value="GAND; GENT; GHENT, BELGIUM">
                  GAND; GENT; GHENT, BELGIUM
                </option>

                <option value="GANDIA, SPAIN">GANDIA, SPAIN</option>

                <option value="GAROUA">GAROUA</option>

                <option value="GASPE, QUE, CA.">GASPE, QUE, CA.</option>

                <option value="GAVLE; GEFLE, SWEDEN">
                  GAVLE; GEFLE, SWEDEN
                </option>

                <option value="GDANSK">GDANSK</option>

                <option value="GDANSK; DANZIG, POLAND">
                  GDANSK; DANZIG, POLAND
                </option>

                <option value="GDYNIA">GDYNIA</option>

                <option value="GDYNIA, POLAND">GDYNIA, POLAND</option>

                <option value="GEBZE PORT,TURKIYE ">GEBZE PORT,TURKIYE </option>

                <option value="GEBZE; PURSAN, TURKEY">
                  GEBZE; PURSAN, TURKEY
                </option>

                <option value="GEELONG CITY, AUS.">GEELONG CITY, AUS.</option>

                <option value="GELA; TERRANOVA, ITALY">
                  GELA; TERRANOVA, ITALY
                </option>

                <option value="GEMLIK PORT, TURKEY ">
                  GEMLIK PORT, TURKEY{" "}
                </option>

                <option value="GEMLIK, TURKEY">GEMLIK, TURKEY</option>

                <option value="GENERAL SANTOS, PH ">GENERAL SANTOS, PH </option>

                <option value="GENOA">GENOA</option>

                <option value="GENOA ITALIAN PORT">GENOA ITALIAN PORT</option>

                <option value="GENOA ITALIAN SEA PORT">
                  GENOA ITALIAN SEA PORT
                </option>

                <option value="GENOA PORT OF ITALY">GENOA PORT OF ITALY</option>

                <option value="GENOA SEAPORT IN ITALY ">
                  GENOA SEAPORT IN ITALY{" "}
                </option>

                <option value="GENOA,ITALY">GENOA,ITALY</option>

                <option value="GENOA; GENOVA, ITALY">
                  GENOA; GENOVA, ITALY
                </option>

                <option value="GENOVA">GENOVA</option>

                <option value="GENOVA PORT IN ITALY">
                  GENOVA PORT IN ITALY
                </option>

                <option value="GENOVA SECH ">GENOVA SECH </option>

                <option value="GEORGETN/ASCENSION/CLARENCE">
                  GEORGETN/ASCENSION/CLARENCE
                </option>

                <option value="GEORGETOWN, GRAND CAYMAN">
                  GEORGETOWN, GRAND CAYMAN
                </option>

                <option value="GEORGETOWN, GUYANA">GEORGETOWN, GUYANA</option>

                <option value="GERALDTON, AUS.">GERALDTON, AUS.</option>

                <option value="GHAZAWET/GHAZAOUET/NEMOURS, AL">
                  GHAZAWET/GHAZAOUET/NEMOURS, AL
                </option>

                <option value="GIBRALTAR">GIBRALTAR</option>

                <option value="GIJON; MOSEL, SPAIN">GIJON; MOSEL, SPAIN</option>

                <option value="GIOIA TAURO, ITALY">GIOIA TAURO, ITALY</option>

                <option value="GIRESUN, TURKEY">GIRESUN, TURKEY</option>

                <option value="GISBORNE, NEW ZEALAND">
                  GISBORNE, NEW ZEALAND
                </option>

                <option value="GIZAN, SAUDI ARABIA">GIZAN, SAUDI ARABIA</option>

                <option value="GLADSTONE, AUS.">GLADSTONE, AUS.</option>

                <option value="GLASGOW, SCOTLAND">GLASGOW, SCOTLAND</option>

                <option value="GOCEK LIMAN, TURKEY">GOCEK LIMAN, TURKEY</option>

                <option value="GODERICH, ONT, CA.">GODERICH, ONT, CA.</option>

                <option value="GODTHAB; GODTHAAB,GREENLAND">
                  GODTHAB; GODTHAAB,GREENLAND
                </option>

                <option value="GOLD RIVER, BC, CA.">GOLD RIVER, BC, CA.</option>

                <option value="GOLD RIVER, NS">GOLD RIVER, NS</option>

                <option value="GOLFITO, COSTA RICA">GOLFITO, COSTA RICA</option>

                <option value="GOLFO DE PALMAS;ORISTANO, ITAL">
                  GOLFO DE PALMAS;ORISTANO, ITAL
                </option>

                <option value="GOLFO DE PARITA, PAN.">
                  GOLFO DE PARITA, PAN.
                </option>

                <option value="GONAIVES, HAITI">GONAIVES, HAITI</option>

                <option value="GOOCH ISLAND, BC">GOOCH ISLAND, BC</option>

                <option value="GOOLE,  ENGLAND">GOOLE, ENGLAND</option>

                <option value="GORDACAY;GREENTURTLE,COCOCAYBA">
                  GORDACAY;GREENTURTLE,COCOCAYBA
                </option>

                <option value="GOTEBORG; GOTHENBURG, SWEDEN">
                  GOTEBORG; GOTHENBURG, SWEDEN
                </option>

                <option value="GOVE, AUSTRAL">GOVE, AUSTRAL</option>

                <option value="GOVERNORS HARBOUR, BAHAMAS">
                  GOVERNORS HARBOUR, BAHAMAS
                </option>

                <option value="GRAND BANK, NFLD">GRAND BANK, NFLD</option>

                <option value="GRAND MANAN ISL, NB, CA.">
                  GRAND MANAN ISL, NB, CA.
                </option>

                <option value="GRAND TURK, TURKS AND CAICOS I">
                  GRAND TURK, TURKS AND CAICOS I
                </option>

                <option value="GRANDE ANSE GRENADA">GRANDE ANSE GRENADA</option>

                <option value="GRANGEMOUTH, SCOTLAND">
                  GRANGEMOUTH, SCOTLAND
                </option>

                <option value="GREAT HARBOUR CAY, BAHAMAS">
                  GREAT HARBOUR CAY, BAHAMAS
                </option>

                <option value="GREAT INAGUA, BAHAMAS">
                  GREAT INAGUA, BAHAMAS
                </option>

                <option value="GREAT STIRRUP CAY, BAHAMAS">
                  GREAT STIRRUP CAY, BAHAMAS
                </option>

                <option value="GREENHITE; GREENHITHE, ENGLAND">
                  GREENHITE; GREENHITHE, ENGLAND
                </option>

                <option value="GREENOCK, SCOTLAND">GREENOCK, SCOTLAND</option>

                <option value="GREENORE, IRELAND">GREENORE, IRELAND</option>

                <option value="GRESIK, JAVA">GRESIK, JAVA</option>

                <option value="GROS CACOUNA,(GROSCACOUNA)QUE">
                  GROS CACOUNA,(GROSCACOUNA)QUE
                </option>

                <option value="GRUNDARFJORDUR, ICELAND">
                  GRUNDARFJORDUR, ICELAND
                </option>

                <option value="GTI, INDIA">GTI, INDIA</option>

                <option value="GUANAJA, HONDURAS">GUANAJA, HONDURAS</option>

                <option value="GUANGZHOU/QUANZHOU, CHINA M">
                  GUANGZHOU/QUANZHOU, CHINA M
                </option>

                <option value="GUANTA, VENEZUELA">GUANTA, VENEZUELA</option>

                <option value="GUARANAO, VENEZUELA">GUARANAO, VENEZUELA</option>

                <option value="GUAYACAN, CHILE">GUAYACAN, CHILE</option>

                <option value="GUAYAQUIL,ECUADOR">GUAYAQUIL,ECUADOR</option>

                <option value="GUAYAQUIL;DURAN, ECUADOR">
                  GUAYAQUIL;DURAN, ECUADOR
                </option>

                <option value="GUAYMAS, MEX.">GUAYMAS, MEX.</option>

                <option value="GUJARAT">GUJARAT</option>

                <option value="GULF OF MEX TNKR TRNS PT">
                  GULF OF MEX TNKR TRNS PT
                </option>

                <option value="GULFHAVN, DENMARK">GULFHAVN, DENMARK</option>

                <option value="HACHINOHE, JAPAN">HACHINOHE, JAPAN</option>

                <option value="HADERA, ISRAEL">HADERA, ISRAEL</option>

                <option value="HADERSLEV, DENMARK">HADERSLEV, DENMARK</option>

                <option value="HAFNARFJORDHUR, ICELAND">
                  HAFNARFJORDHUR, ICELAND
                </option>

                <option value="HAI PHONG PORT, VIETNAM">
                  HAI PHONG PORT, VIETNAM
                </option>

                <option value="HAI PHONG; HAIPHONG, VIETMAN">
                  HAI PHONG; HAIPHONG, VIETMAN
                </option>

                <option value="HAIFA, ISRAEL">HAIFA, ISRAEL</option>

                <option value="HAIKOU,  CHINA M">HAIKOU, CHINA M</option>

                <option value="HAIPHONG PORT, VIETNAM">
                  HAIPHONG PORT, VIETNAM
                </option>

                <option value="HAIPHONG, VIETNAM">HAIPHONG, VIETNAM</option>

                <option value="HAKATA, JAPAN">HAKATA, JAPAN</option>

                <option value="HAKODATE, JAPAN">HAKODATE, JAPAN</option>

                <option value="HALDEN, NOR.">HALDEN, NOR.</option>

                <option value="HALDIA, INDIA">HALDIA, INDIA</option>

                <option value="HALF MOON CAY,BAHAMAS">
                  HALF MOON CAY,BAHAMAS
                </option>

                <option value="HALIFAX, CANADA ">HALIFAX, CANADA </option>

                <option value="HALIFAX, NS">HALIFAX, NS</option>

                <option value="HALIFAX, NS CANADA">HALIFAX, NS CANADA</option>

                <option value="HALIFAX, NS, CA.">HALIFAX, NS, CA.</option>

                <option value="HALLSTAVIK, SWEDEN">HALLSTAVIK, SWEDEN</option>

                <option value="HALMSTAD, SWEDEN">HALMSTAD, SWEDEN</option>

                <option value="HALSINGBORG, SWEDEN">HALSINGBORG, SWEDEN</option>

                <option value="HAMAD, QATAR">HAMAD, QATAR</option>

                <option value="HAMBURG">HAMBURG</option>

                <option value="HAMBURG GERMAN SEAPORT">
                  HAMBURG GERMAN SEAPORT
                </option>

                <option value="HAMBURG PORT, GERMANY">
                  HAMBURG PORT, GERMANY
                </option>

                <option value="HAMBURG SEAPORT, GERMANY">
                  HAMBURG SEAPORT, GERMANY
                </option>

                <option value="HAMBURG, EUROPEAN SEAPORT">
                  HAMBURG, EUROPEAN SEAPORT
                </option>

                <option value="HAMBURG, GERMANY PORT ">
                  HAMBURG, GERMANY PORT{" "}
                </option>

                <option value="HAMBURG, W. GER.">HAMBURG, W. GER.</option>

                <option value="HAMBURG,GERMANY">HAMBURG,GERMANY</option>

                <option value="HAMILTON, BERMUDA">HAMILTON, BERMUDA</option>

                <option value="HAMILTON, ONT, CA.">HAMILTON, ONT, CA.</option>

                <option value="HAMINA;FREDRIKSHAMN, FINLAND">
                  HAMINA;FREDRIKSHAMN, FINLAND
                </option>

                <option value="HAMIRIYAH PORT">HAMIRIYAH PORT</option>

                <option value="HAMMERFEST, NORWAY">HAMMERFEST, NORWAY</option>

                <option value="HANKO; HANGO, FINLAND">
                  HANKO; HANGO, FINLAND
                </option>

                <option value="HANKOW; WUHAN, CHINA M">
                  HANKOW; WUHAN, CHINA M
                </option>

                <option value="HANTSPORT, NS, CA.">HANTSPORT, NS, CA.</option>

                <option value="HARBOUR BRETON, NFLD">
                  HARBOUR BRETON, NFLD
                </option>

                <option value="HARBOUR GRACE, NFLD">HARBOUR GRACE, NFLD</option>

                <option value="HARBURG, FR GERMANY">HARBURG, FR GERMANY</option>

                <option value="HARMAC, BC CANADA">HARMAC, BC CANADA</option>

                <option value="HARTLEPOOL, ENGLAND">HARTLEPOOL, ENGLAND</option>

                <option value="HAUGESUND, NOR.">HAUGESUND, NOR.</option>

                <option value="HAYDARPASA, TURKEY">HAYDARPASA, TURKEY</option>

                <option value="HAZIRA PORT, INDIA">HAZIRA PORT, INDIA</option>

                <option value="HAZIRA, INDIA">HAZIRA, INDIA</option>

                <option value="HELSINGBORG ">HELSINGBORG </option>

                <option value="HELSINGBORG, SWEDEN ">
                  HELSINGBORG, SWEDEN{" "}
                </option>

                <option value="HELSINKI, FINLAND">HELSINKI, FINLAND</option>

                <option value="HELSINKI; HELSINGFORS, FINLAND">
                  HELSINKI; HELSINGFORS, FINLAND
                </option>

                <option value="HEMIKSEM;HIMIXEN, BELGIUM">
                  HEMIKSEM;HIMIXEN, BELGIUM
                </option>

                <option value="HERAKLION; IRAKLION, GREECE">
                  HERAKLION; IRAKLION, GREECE
                </option>

                <option value="HEROEN, NORWAY">HEROEN, NORWAY</option>

                <option value="HERON BAY, ONT.  CA.">
                  HERON BAY, ONT. CA.
                </option>

                <option value="HIBERNIA,NFDL,BULL ARM NFLD CA">
                  HIBERNIA,NFDL,BULL ARM NFLD CA
                </option>

                <option value="HIGASHIHARIMA-KO, JAPAN">
                  HIGASHIHARIMA-KO, JAPAN
                </option>

                <option value="HIGH SEAS TNKR TRANS PT">
                  HIGH SEAS TNKR TRANS PT
                </option>

                <option value="HIMEJI, JAPAN">HIMEJI, JAPAN</option>

                <option value="HIROHATA, JAPAN">HIROHATA, JAPAN</option>

                <option value="HIROSHIMA, JAPAN">HIROSHIMA, JAPAN</option>

                <option value="HITACHI, JAPAN">HITACHI, JAPAN</option>

                <option value="HO CHI MINH">HO CHI MINH</option>

                <option value="HO CHI MINH CITY (SAIGON),VNAM">
                  HO CHI MINH CITY (SAIGON),VNAM
                </option>

                <option value="HO CHI MINH CITY PORT, VIET NAM ">
                  HO CHI MINH CITY PORT, VIET NAM{" "}
                </option>

                <option value="HO CHI MINH CITY, VIET NAM">
                  HO CHI MINH CITY, VIET NAM
                </option>

                <option value="HOBART, TASMANIA">HOBART, TASMANIA</option>

                <option value="HOBRO, DENMARK">HOBRO, DENMARK</option>

                <option value="HOCHIMINH, VIETNAM">HOCHIMINH, VIETNAM</option>

                <option value="HODEIDA;AL HUDAYAH, YEMEN">
                  HODEIDA;AL HUDAYAH, YEMEN
                </option>

                <option value="HOGANAS, SWEDEN">HOGANAS, SWEDEN</option>

                <option value="HOLBAEK, DENMARK">HOLBAEK, DENMARK</option>

                <option value="HOLLA, NOR.">HOLLA, NOR.</option>

                <option value="HOLMSUND, SWEDEN">HOLMSUND, SWEDEN</option>

                <option value="HOLYHEAD, WALES">HOLYHEAD, WALES</option>

                <option value="HOLYROOD, NFLD, CA.">HOLYROOD, NFLD, CA.</option>

                <option value="HON GAI; HON GAY, VIETMAN">
                  HON GAI; HON GAY, VIETMAN
                </option>

                <option value="HONDAGUA, PHILIPPINES">
                  HONDAGUA, PHILIPPINES
                </option>

                <option value="HONG KONG">HONG KONG</option>

                <option value="HORSENS, DENMARK">HORSENS, DENMARK</option>

                <option value="HOUND POINT, SCOTLAND">
                  HOUND POINT, SCOTLAND
                </option>

                <option value="HSINKANG; XINGANG, CHINA M">
                  HSINKANG; XINGANG, CHINA M
                </option>

                <option value="HUALIEN, CHINA TAIWAN">
                  HUALIEN, CHINA TAIWAN
                </option>

                <option value="HUANG PU PORT, CHINA">
                  HUANG PU PORT, CHINA
                </option>

                <option value="HUANGPU; WHAMPOA, CHINA M">
                  HUANGPU; WHAMPOA, CHINA M
                </option>

                <option value="HUASCO, CHILE">HUASCO, CHILE</option>

                <option value="HUELVA, SPAIN">HUELVA, SPAIN</option>

                <option value="HULL, ENGLAND">HULL, ENGLAND</option>

                <option value="HUNTERSTON, SCOTLAND">
                  HUNTERSTON, SCOTLAND
                </option>

                <option value="IALI; YALI ISLAND, GREECE">
                  IALI; YALI ISLAND, GREECE
                </option>

                <option value="IBIZA, SPAIN">IBIZA, SPAIN</option>

                <option value="IGGESUND, SWEDEN">IGGESUND, SWEDEN</option>

                <option value="IJMUIDEN; YUMEDEN, NETHERLANDS">
                  IJMUIDEN; YUMEDEN, NETHERLANDS
                </option>

                <option value="ILHEUS; MALHADO, BRAZIL">
                  ILHEUS; MALHADO, BRAZIL
                </option>

                <option value="ILIGAN, PHILIPPINES">ILIGAN, PHILIPPINES</option>

                <option value="ILLICHEVSK; ILLYICHEVSK, UKRN">
                  ILLICHEVSK; ILLYICHEVSK, UKRN
                </option>

                <option value="ILO, PERU">ILO, PERU</option>

                <option value="ILOILO, PHILIPPINES">ILOILO, PHILIPPINES</option>

                <option value="IMARI, JAPAN">IMARI, JAPAN</option>

                <option value="IMBITUBA, BRAZIL">IMBITUBA, BRAZIL</option>

                <option value="IMMINGHAM, ENGLAND">IMMINGHAM, ENGLAND</option>

                <option value="INCHEON KOREAN PORT ">
                  INCHEON KOREAN PORT{" "}
                </option>

                <option value="INCHEON PORT">INCHEON PORT</option>

                <option value="INCHEON PORT KOREA">INCHEON PORT KOREA</option>

                <option value="INCHEON PORT SOUTH KOREA">
                  INCHEON PORT SOUTH KOREA
                </option>

                <option value="INCHEON PORT, KOREA">INCHEON PORT, KOREA</option>

                <option value="INCHEON PORT, SOUTH KOREA">
                  INCHEON PORT, SOUTH KOREA
                </option>

                <option value="INCHEON, SOUTH KOREA">
                  INCHEON, SOUTH KOREA
                </option>

                <option value="INCHON">INCHON</option>

                <option value="INCHON; JINSEN, REP. OF KOREA">
                  INCHON; JINSEN, REP. OF KOREA
                </option>

                <option value="INKOO; INGA, FINLAND">
                  INKOO; INGA, FINLAND
                </option>

                <option value="INVERKIP, SCOTLAND">INVERKIP, SCOTLAND</option>

                <option value="INVERNESS, SCOTLAND">INVERNESS, SCOTLAND</option>

                <option value="IQUIQUE, CHILE">IQUIQUE, CHILE</option>

                <option value="IQUITOS, PERU">IQUITOS, PERU</option>

                <option value="IRVINE, SCOTLAND">IRVINE, SCOTLAND</option>

                <option value="ISABEL, PHILIPPINES">ISABEL, PHILIPPINES</option>

                <option value="ISDEMIR, TURKEY">ISDEMIR, TURKEY</option>

                <option value="ISHINOMAKI, JAPAN">ISHINOMAKI, JAPAN</option>

                <option value="ISKENDERUN, TURKEY">ISKENDERUN, TURKEY</option>

                <option value="ISLA MUJERES, MEX.">ISLA MUJERES, MEX.</option>

                <option value="ISLAS CORONADOS, MEX.">
                  ISLAS CORONADOS, MEX.
                </option>

                <option value="ISTANBUL AMBARLI,TURKEY">
                  ISTANBUL AMBARLI,TURKEY
                </option>

                <option value="ISTANBUL KUMPORT,TURKEY ">
                  ISTANBUL KUMPORT,TURKEY{" "}
                </option>

                <option value="ISTANBUL SEAPORT,TURKEY ">
                  ISTANBUL SEAPORT,TURKEY{" "}
                </option>

                <option value="ISTANBUL TURKIYE">ISTANBUL TURKIYE</option>

                <option value="ISTANBUL, TURKEY ">ISTANBUL, TURKEY </option>

                <option value="ISTANBUL-AMBARLI TURKIYE ">
                  ISTANBUL-AMBARLI TURKIYE{" "}
                </option>

                <option value="ISTANBULCONSTANTINOPLE,AMBARLI">
                  ISTANBULCONSTANTINOPLE,AMBARLI
                </option>

                <option value="ITACOATIARA, BRAZ.">ITACOATIARA, BRAZ.</option>

                <option value="ITAGUAI, SEPETIBA BAY, BRAZIL">
                  ITAGUAI, SEPETIBA BAY, BRAZIL
                </option>

                <option value="ITAJAI">ITAJAI</option>

                <option value="ITAJAI - SC - BRAZIL">
                  ITAJAI - SC - BRAZIL
                </option>

                <option value="ITAJAI, BRAZ.">ITAJAI, BRAZ.</option>

                <option value="ITAPOA, BRAZIL">ITAPOA, BRAZIL</option>

                <option value="ITAQUI, BRAZIL">ITAQUI, BRAZIL</option>

                <option value="ITEA, GREECE">ITEA, GREECE</option>

                <option value="IWAKUNI, JAPAN">IWAKUNI, JAPAN</option>

                <option value="IZMIR - ALIAGA, TURKEY">
                  IZMIR - ALIAGA, TURKEY
                </option>

                <option value="IZMIR PORT, TURKIYE">IZMIR PORT, TURKIYE</option>

                <option value="IZMIR SEA PORT TURKEY">
                  IZMIR SEA PORT TURKEY
                </option>

                <option value="IZMIR SEAPORT, TURKEY ">
                  IZMIR SEAPORT, TURKEY{" "}
                </option>

                <option value="IZMIR, TURKEY">IZMIR, TURKEY</option>

                <option value="IZMIT">IZMIT</option>

                <option value="IZMIT EVYAP PORT TURKIYE">
                  IZMIT EVYAP PORT TURKIYE
                </option>

                <option value="IZMIT EVYAP PORT,TURKEY ">
                  IZMIT EVYAP PORT,TURKEY{" "}
                </option>

                <option value="IZMIT KORFEZI">IZMIT KORFEZI</option>

                <option value="IZMIT PORT, TURKEY">IZMIT PORT, TURKEY</option>

                <option value="IZMIT SEA PORT, TURKIYE">
                  IZMIT SEA PORT, TURKIYE
                </option>

                <option value="IZMIT TURKEY PORT ">IZMIT TURKEY PORT </option>

                <option value="IZMIT, KOCAELI, TURKIYE">
                  IZMIT, KOCAELI, TURKIYE
                </option>

                <option value="IZMIT, TURKEY">IZMIT, TURKEY</option>

                <option value="IZMIT,TUTUNCIFTLIK TURKEY">
                  IZMIT,TUTUNCIFTLIK TURKEY
                </option>

                <option value="IZMIT/EVYAP PORT,TURKEY">
                  IZMIT/EVYAP PORT,TURKEY
                </option>

                <option value="JACMEL, HAITI">JACMEL, HAITI</option>

                <option value="JAKARTA PORT, INDONESIA">
                  JAKARTA PORT, INDONESIA
                </option>

                <option value="JAKARTA UTARA, INDONESIA">
                  JAKARTA UTARA, INDONESIA
                </option>

                <option value="JAKARTA, INDONESIA">JAKARTA, INDONESIA</option>

                <option value="JAKARTA,INDONESIA">JAKARTA,INDONESIA</option>

                <option value="JAMBI; DJAMBI, SUMATRA">
                  JAMBI; DJAMBI, SUMATRA
                </option>

                <option value="JAWAHARLAL NEHRU; NAVA SHEVA">
                  JAWAHARLAL NEHRU; NAVA SHEVA
                </option>

                <option value="JEBEL ALI">JEBEL ALI</option>

                <option value="JEBEL ALI PORT">JEBEL ALI PORT</option>

                <option value="JEBEL ALI PORT, DUBAI, UAE">
                  JEBEL ALI PORT, DUBAI, UAE
                </option>

                <option value="JEBEL ALI, ARAB EM">JEBEL ALI, ARAB EM</option>

                <option value="JEBEL ALI, UAE">JEBEL ALI, UAE</option>

                <option value="JEBEL ALI,DUBAI">JEBEL ALI,DUBAI</option>

                <option value="JEBEL ALI,UNITED ARAB EMIRATES">
                  JEBEL ALI,UNITED ARAB EMIRATES
                </option>

                <option value="JEBEL DHANNA; RUWAIS, ARAB EM">
                  JEBEL DHANNA; RUWAIS, ARAB EM
                </option>

                <option value="JEDDAH">JEDDAH</option>

                <option value="JEDDAH PORT IN KINGDOM OF SAUDI ARABIA ">
                  JEDDAH PORT IN KINGDOM OF SAUDI ARABIA{" "}
                </option>

                <option value="JEDDAH, SAUDI ARABIAN SEAPORT ">
                  JEDDAH, SAUDI ARABIAN SEAPORT{" "}
                </option>

                <option value="JERVIS INLET, BC">JERVIS INLET, BC</option>

                <option value="JIANGYIN, CHINA">JIANGYIN, CHINA</option>

                <option value="JIUZHOU/ZHUHAI, CHINA M">
                  JIUZHOU/ZHUHAI, CHINA M
                </option>

                <option value="JNPT, INDIA">JNPT, INDIA</option>

                <option value="JOHORE;PASIR GUDANG,  MALAYSA">
                  JOHORE;PASIR GUDANG, MALAYSA
                </option>

                <option value="JOSE PANGANIBAN, PHILIPPINES">
                  JOSE PANGANIBAN, PHILIPPINES
                </option>

                <option value="JOSE,PUERTOJOSE,PETROZUATAVZ">
                  JOSE,PUERTOJOSE,PETROZUATAVZ
                </option>

                <option value="JUAYMAH, SAUDI AR.">JUAYMAH, SAUDI AR.</option>

                <option value="KAGOSHIMA, JAPAN">KAGOSHIMA, JAPAN</option>

                <option value="KALAMAI; CALAMATA, GREECE">
                  KALAMAI; CALAMATA, GREECE
                </option>

                <option value="KALAMAKI,GREECE">KALAMAKI,GREECE</option>

                <option value="KALI LIMENES (KALOI LIMNIONES)">
                  KALI LIMENES (KALOI LIMNIONES)
                </option>

                <option value="KALUNDBORG; ASNAES, DENMARK">
                  KALUNDBORG; ASNAES, DENMARK
                </option>

                <option value="KAMAISHI, JAPAN">KAMAISHI, JAPAN</option>

                <option value="KAMSAR, GUINEA">KAMSAR, GUINEA</option>

                <option value="KANADO/YAENE, JAPAN">KANADO/YAENE, JAPAN</option>

                <option value="KANDA, JAPAN">KANDA, JAPAN</option>

                <option value="KANDLA">KANDLA</option>

                <option value="KANDLA, INDIA">KANDLA, INDIA</option>

                <option value="KANOKAWA, JAPAN">KANOKAWA, JAPAN</option>

                <option value="KANTANG, THAILAND">KANTANG, THAILAND</option>

                <option value="KAOHSIUNG">KAOHSIUNG</option>

                <option value="KAOHSIUNG, CHINA(TAIWAN)">
                  KAOHSIUNG, CHINA(TAIWAN)
                </option>

                <option value="KAOHSIUNG, TAIWAN">KAOHSIUNG, TAIWAN</option>

                <option value="KARACHI">KARACHI</option>

                <option value="KARACHI PORT - PAKISTAN">
                  KARACHI PORT - PAKISTAN
                </option>

                <option value="KARACHI PORT, PAKISTAN">
                  KARACHI PORT, PAKISTAN
                </option>

                <option value="KARACHI PORT. PAKISTAN">
                  KARACHI PORT. PAKISTAN
                </option>

                <option value="KARACHI SEA PORT, PAKISTAN ">
                  KARACHI SEA PORT, PAKISTAN{" "}
                </option>

                <option value="KARACHI SEAPORT, PAKISTAN">
                  KARACHI SEAPORT, PAKISTAN
                </option>

                <option value="KARACHI, PAKISTAN">KARACHI, PAKISTAN</option>

                <option value="KARATSU, JAPAN">KARATSU, JAPAN</option>

                <option value="KARDELJEVO; PLOCE, CROATIA">
                  KARDELJEVO; PLOCE, CROATIA
                </option>

                <option value="KARLSBORG, SWEDEN">KARLSBORG, SWEDEN</option>

                <option value="KARLSHAMN, SWEDEN">KARLSHAMN, SWEDEN</option>

                <option value="KASAOKA, JAPAN">KASAOKA, JAPAN</option>

                <option value="KASHIMA, JAPAN">KASHIMA, JAPAN</option>

                <option value="KASHIWAZAKI, JAPAN">KASHIWAZAKI, JAPAN</option>

                <option value="KASIM; SORONG, WEST NEW GUINEA">
                  KASIM; SORONG, WEST NEW GUINEA
                </option>

                <option value="KATAKOLON, GREECE">KATAKOLON, GREECE</option>

                <option value="KATTUPALLI PORT, INDIA">
                  KATTUPALLI PORT, INDIA
                </option>

                <option value="KATTUPALLI SEA PORT INDIA ">
                  KATTUPALLI SEA PORT INDIA{" "}
                </option>

                <option value="KATTUPALLI, INDIA">KATTUPALLI, INDIA</option>

                <option value="KATTUPALLI,CHENNAI">KATTUPALLI,CHENNAI</option>

                <option value="KAVALA; CAVALA, GREECE">
                  KAVALA; CAVALA, GREECE
                </option>

                <option value="KAW-IBO TERMINAL; QUO IBOE, NG">
                  KAW-IBO TERMINAL; QUO IBOE, NG
                </option>

                <option value="KAWANOE, JAPAN">KAWANOE, JAPAN</option>

                <option value="KAWASAKI, JAPAN">KAWASAKI, JAPAN</option>

                <option value="KEELUNG">KEELUNG</option>

                <option value="KEELUNG, CHINA (TAIWAN)">
                  KEELUNG, CHINA (TAIWAN)
                </option>

                <option value="KEELUNG, TAIWAN">KEELUNG, TAIWAN</option>

                <option value="KEIHIN, JAPAN">KEIHIN, JAPAN</option>

                <option value="KELANG  PORT SWETTENHAM">
                  KELANG PORT SWETTENHAM
                </option>

                <option value="KEMI, FIN.">KEMI, FIN.</option>

                <option value="KENDIRI, INDONESIA">KENDIRI, INDONESIA</option>

                <option value="KERCH, UKRAINE">KERCH, UKRAINE</option>

                <option value="KERETH, MALAYSIA">KERETH, MALAYSIA</option>

                <option value="KHORFAKKAN, ARAB EM">KHORFAKKAN, ARAB EM</option>

                <option value="KIDJANG; SUNGAI KOLAK, RIOW IS">
                  KIDJANG; SUNGAI KOLAK, RIOW IS
                </option>

                <option value="KIEL; HOLTENAU, FR GERMANY">
                  KIEL; HOLTENAU, FR GERMANY
                </option>

                <option value="KIIRE, JAPAN">KIIRE, JAPAN</option>

                <option value="KILLINGHOLME, UNITED KINGDOM">
                  KILLINGHOLME, UNITED KINGDOM
                </option>

                <option value="KIMITSU, JAPAN">KIMITSU, JAPAN</option>

                <option value="KING ABDULLAH PORT">KING ABDULLAH PORT</option>

                <option value="KINGS NORTH; KINGSNORTH, ENG.">
                  KINGS NORTH; KINGSNORTH, ENG.
                </option>

                <option value="KINGSTON, JAMAICA">KINGSTON, JAMAICA</option>

                <option value="KINGSTON, ONT, CA.">KINGSTON, ONT, CA.</option>

                <option value="KINGSTOWN,ST.VINCENT/N GRENDIN">
                  KINGSTOWN,ST.VINCENT/N GRENDIN
                </option>

                <option value="KINGSVILLE, CANADA">KINGSVILLE, CANADA</option>

                <option value="KINUURA, JAPAN">KINUURA, JAPAN</option>

                <option value="KITA KYUSHU; KITAKYUSHU, JAPAN">
                  KITA KYUSHU; KITAKYUSHU, JAPAN
                </option>

                <option value="KITIMAT, BC, CA.">KITIMAT, BC, CA.</option>

                <option value="KJOGE; KOGE, DENMARK">
                  KJOGE; KOGE, DENMARK
                </option>

                <option value="KLAIPEDA">KLAIPEDA</option>

                <option value="KLAIPEDA PORT, LITHUANIA">
                  KLAIPEDA PORT, LITHUANIA
                </option>

                <option value="KLAIPEDA, LITHUANIA">KLAIPEDA, LITHUANIA</option>

                <option value="KO SICHANG, THAILAND">
                  KO SICHANG, THAILAND
                </option>

                <option value="KOBE, JAPAN">KOBE, JAPAN</option>

                <option value="KOCHI, JAPAN">KOCHI, JAPAN</option>

                <option value="KOKO, NIGERIA">KOKO, NIGERIA</option>

                <option value="KOKURA, JAPAN">KOKURA, JAPAN</option>

                <option value="KOLDING, DENMARK">KOLDING, DENMARK</option>

                <option value="KOLKATA, INDIA">KOLKATA, INDIA</option>

                <option value="KOLKATA, SEAPORT">KOLKATA, SEAPORT</option>

                <option value="KOMATSUJIMA, JAPAN">KOMATSUJIMA, JAPAN</option>

                <option value="KOPER EUROPEAN PORT">KOPER EUROPEAN PORT</option>

                <option value="KOPER PORT IN EUROPE ">
                  KOPER PORT IN EUROPE{" "}
                </option>

                <option value="KOPER, SLOVENIA">KOPER, SLOVENIA</option>

                <option value="KOPER; KOPAR,  SLOVENIA">
                  KOPER; KOPAR, SLOVENIA
                </option>

                <option value="KORSOR, DENMARK">KORSOR, DENMARK</option>

                <option value="KOTA KINABALU, MALAYSIA">
                  KOTA KINABALU, MALAYSIA
                </option>

                <option value="KOTKA, FIN.">KOTKA, FIN.</option>

                <option value="KOVERHAR, FINLAND">KOVERHAR, FINLAND</option>

                <option value="KOWLOON, HONG KONG">KOWLOON, HONG KONG</option>

                <option value="KRIBI, CAMEROON">KRIBI, CAMEROON</option>

                <option value="KRISHNAPATNAM">KRISHNAPATNAM</option>

                <option value="KRISTIANSAND N,  NORWAY">
                  KRISTIANSAND N, NORWAY
                </option>

                <option value="KRISTIANSAND S,  NORWAY">
                  KRISTIANSAND S, NORWAY
                </option>

                <option value="KUALA SELANGOR,  MALAYSA">
                  KUALA SELANGOR, MALAYSA
                </option>

                <option value="KUALA TANJUNG, SUMATRA">
                  KUALA TANJUNG, SUMATRA
                </option>

                <option value="KUALA TERRENGGANU,  MALAYSA">
                  KUALA TERRENGGANU, MALAYSA
                </option>

                <option value="KUANTAN, MALAYSA">KUANTAN, MALAYSA</option>

                <option value="KUCHING, MALAYSIA">KUCHING, MALAYSIA</option>

                <option value="KUDAMATSU, JAPAN">KUDAMATSU, JAPAN</option>

                <option value="KUMPORT">KUMPORT</option>

                <option value="KUMPORT ISTANBUL TURKIYE ">
                  KUMPORT ISTANBUL TURKIYE{" "}
                </option>

                <option value="KUNSAN, KOREA">KUNSAN, KOREA</option>

                <option value="KURE; HIRO, JAPAN">KURE; HIRO, JAPAN</option>

                <option value="KUSHIRO, JAPAN">KUSHIRO, JAPAN</option>

                <option value="KUWAIT">KUWAIT</option>

                <option value="KUWAIT; AL KUWAIT, KUWAIT">
                  KUWAIT; AL KUWAIT, KUWAIT
                </option>

                <option value="KWANGYANG, KOR REP">KWANGYANG, KOR REP</option>

                <option value="KWINANA, AUS">KWINANA, AUS</option>

                <option value="KYMASSI, GREECE">KYMASSI, GREECE</option>

                <option value="KYNDBY, DENMARK">KYNDBY, DENMARK</option>

                <option value="LA CEIBA,UTILABAY HONDURAS">
                  LA CEIBA,UTILABAY HONDURAS
                </option>

                <option value="LA CORUNA; CORUNNA, SPAIN">
                  LA CORUNA; CORUNNA, SPAIN
                </option>

                <option value="LA GOULETTE, TUNISIA">
                  LA GOULETTE, TUNISIA
                </option>

                <option value="LA GUAIRA, VENEZUELA">
                  LA GUAIRA, VENEZUELA
                </option>

                <option value="LA LIBERTAD, ECU">LA LIBERTAD, ECU</option>

                <option value="LA PALLICE, FRANCE">LA PALLICE, FRANCE</option>

                <option value="LA PALMA, PAN.">LA PALMA, PAN.</option>

                <option value="LA PAMPILLA, PERU">LA PAMPILLA, PERU</option>

                <option value="LA PAZ, MEXICO">LA PAZ, MEXICO</option>

                <option value="LA PLATA, ARG.">LA PLATA, ARG.</option>

                <option value="LA ROMANA, DOM. REP.">
                  LA ROMANA, DOM. REP.
                </option>

                <option value="LA SALINA, VEN.">LA SALINA, VEN.</option>

                <option value="LA SKHIRA,  TUNISIA">LA SKHIRA, TUNISIA</option>

                <option value="LA SPEZIA PORT OF ITALY">
                  LA SPEZIA PORT OF ITALY
                </option>

                <option value="LA SPEZIA, ITALY">LA SPEZIA, ITALY</option>

                <option value="LA UNION, EL SALV.">LA UNION, EL SALV.</option>

                <option value="LAAYONNE, WESTERN SAHARA">
                  LAAYONNE, WESTERN SAHARA
                </option>

                <option value="LABADEE, HAITI">LABADEE, HAITI</option>

                <option value="LABUAN; VICTORIA, MALAYSIA">
                  LABUAN; VICTORIA, MALAYSIA
                </option>

                <option value="LADYSMITH, BC">LADYSMITH, BC</option>

                <option value="LAE, NEW GUINEA">LAE, NEW GUINEA</option>

                <option value="LAEM CHABANG">LAEM CHABANG</option>

                <option value="LAEM CHABANG PORT IN THAILAND">
                  LAEM CHABANG PORT IN THAILAND
                </option>

                <option value="LAEM CHABANG PORT, THAILAND ">
                  LAEM CHABANG PORT, THAILAND{" "}
                </option>

                <option value="LAEM CHABANG, THAILAND">
                  LAEM CHABANG, THAILAND
                </option>

                <option value="LAFITEAU, HAITI">LAFITEAU, HAITI</option>

                <option value="LAGOS; TIN CAN ISLAND, NIGERIA">
                  LAGOS; TIN CAN ISLAND, NIGERIA
                </option>

                <option value="LAHAD DATU, MALAYSIA">
                  LAHAD DATU, MALAYSIA
                </option>

                <option value="LALANG TERMINAL, JAVA">
                  LALANG TERMINAL, JAVA
                </option>

                <option value="LANDS END, ENGLAND">LANDS END, ENGLAND</option>

                <option value="LANSKRONA, SWEDEN">LANSKRONA, SWEDEN</option>

                <option value="LAPPAJARVI, FINLAND">LAPPAJARVI, FINLAND</option>

                <option value="LAPPOHJA, FINLAND">LAPPOHJA, FINLAND</option>

                <option value="LARNACA, CYPRUS">LARNACA, CYPRUS</option>

                <option value="LARVIK, NORWAY">LARVIK, NORWAY</option>

                <option value="LAS MINAS BAY, PAN">LAS MINAS BAY, PAN</option>

                <option value="LAS PALMAS, CANARY ISLANDS">
                  LAS PALMAS, CANARY ISLANDS
                </option>

                <option value="LAS PIEDRAS, VEN.">LAS PIEDRAS, VEN.</option>

                <option value="LAUNCESTON,TASMANIA">LAUNCESTON,TASMANIA</option>

                <option value="LAVERA, FRANCE">LAVERA, FRANCE</option>

                <option value="LAVERA: L`AVERA, FRANCE">
                  LAVERA: L`AVERA, FRANCE
                </option>

                <option value="LAWE LAWE TERMINAL, KALIMANTAN">
                  LAWE LAWE TERMINAL, KALIMANTAN
                </option>

                <option value="LAZARO CARDENAS, MEX.">
                  LAZARO CARDENAS, MEX.
                </option>

                <option value="LAZARO CARDENAS, MEXICO">
                  LAZARO CARDENAS, MEXICO
                </option>

                <option value="LE BOUCAU; BOUCAU, FRANCE">
                  LE BOUCAU; BOUCAU, FRANCE
                </option>

                <option value="LE HAVRE, FRANCE">LE HAVRE, FRANCE</option>

                <option value="LE VERDON; VERDON, FRANCE">
                  LE VERDON; VERDON, FRANCE
                </option>

                <option value="LEAMINGTON, ONT, CANADA">
                  LEAMINGTON, ONT, CANADA
                </option>

                <option value="LEGASPI, PHILIPPINES">
                  LEGASPI, PHILIPPINES
                </option>

                <option value="LEGHORN, ITALY">LEGHORN, ITALY</option>

                <option value="LEGHORN; LIVORNO, ITALY">
                  LEGHORN; LIVORNO, ITALY
                </option>

                <option value="LEIXOES">LEIXOES</option>

                <option value="LEIXOES, PORTUGAL">LEIXOES, PORTUGAL</option>

                <option value="LEVIS, QUE, CA.">LEVIS, QUE, CA.</option>

                <option value="LIANYUNGANG">LIANYUNGANG</option>

                <option value="LIANYUNGANG, CHINA">LIANYUNGANG, CHINA</option>

                <option value="LIANYUNGANG, CHINA M">
                  LIANYUNGANG, CHINA M
                </option>

                <option value="LIBREVILLE, GABON">LIBREVILLE, GABON</option>

                <option value="LIEZEN, AUS.">LIEZEN, AUS.</option>

                <option value="LIMASSOL PORT, CYPRUS">
                  LIMASSOL PORT, CYPRUS
                </option>

                <option value="LIMASSOL, CYPRUS">LIMASSOL, CYPRUS</option>

                <option value="LIMAY, PHILIPPINES">LIMAY, PHILIPPINES</option>

                <option value="LIMBOH TERMINAL, VICTORIA CAM">
                  LIMBOH TERMINAL, VICTORIA CAM
                </option>

                <option value="LIMERICK, IRELAND">LIMERICK, IRELAND</option>

                <option value="LIMON, HOND.">LIMON, HOND.</option>

                <option value="LINDEN, GUYANA">LINDEN, GUYANA</option>

                <option value="LIPARI, ITALY">LIPARI, ITALY</option>

                <option value="LIRQUEN, CHILE">LIRQUEN, CHILE</option>

                <option value="LISBON, PORTUGAL ">LISBON, PORTUGAL </option>

                <option value="LISBON; LISBOA, PORTUGAL">
                  LISBON; LISBOA, PORTUGAL
                </option>

                <option value="LITTLE CURRENT, ONT, CA.">
                  LITTLE CURRENT, ONT, CA.
                </option>

                <option value="LITTLE NARROWS, CBI, CA.">
                  LITTLE NARROWS, CBI, CA.
                </option>

                <option value="LIVERPOOL, ENGLAND">LIVERPOOL, ENGLAND</option>

                <option value="LIVERPOOL, NS, CA.">LIVERPOOL, NS, CA.</option>

                <option value="LIVORNO">LIVORNO</option>

                <option value="LOBITO, ANGOLA">LOBITO, ANGOLA</option>

                <option value="LOMBO,PORTLOMBO,LOMBO TERMINAL">
                  LOMBO,PORTLOMBO,LOMBO TERMINAL
                </option>

                <option value="LOME, TOGO">LOME, TOGO</option>

                <option value="LONDON GATEWAY PORT, UNITED KINGDOM ">
                  LONDON GATEWAY PORT, UNITED KINGDOM{" "}
                </option>

                <option value="LONDON GATEWAY, UK">LONDON GATEWAY, UK</option>

                <option value="LONDON, ENGLAND">LONDON, ENGLAND</option>

                <option value="LONDONDERRY, NORTHERN IRELAND">
                  LONDONDERRY, NORTHERN IRELAND
                </option>

                <option value="LONG HARBOR, NFLD, CA.">
                  LONG HARBOR, NFLD, CA.
                </option>

                <option value="LONG POND, NFLD, CA">LONG POND, NFLD, CA</option>

                <option value="LONGS WHARF, JAM.">LONGS WHARF, JAM.</option>

                <option value="LORIENT, FRANCE">LORIENT, FRANCE</option>

                <option value="LOUISBURG, NS, CA">LOUISBURG, NS, CA</option>

                <option value="LOVIISA; LOVISA, FINLAND">
                  LOVIISA; LOVISA, FINLAND
                </option>

                <option value="LUANDA, ANGOLA">LUANDA, ANGOLA</option>

                <option value="LUCINA, GABON">LUCINA, GABON</option>

                <option value="LULEA, SWEDEN">LULEA, SWEDEN</option>

                <option value="LUMUT,  MALAYSA">LUMUT, MALAYSA</option>

                <option value="LUNENBURG, NS">LUNENBURG, NS</option>

                <option value="LUPERON, DOMINICAN REPUBLIC">
                  LUPERON, DOMINICAN REPUBLIC
                </option>

                <option value="LUSHUN; PORT ARTHUR, CHINA M">
                  LUSHUN; PORT ARTHUR, CHINA M
                </option>

                <option value="LYTTLETON, NEW ZEALAND">
                  LYTTLETON, NEW ZEALAND
                </option>

                <option value="MAALOY, NORWAY">MAALOY, NORWAY</option>

                <option value="MACAO, MACAU">MACAO, MACAU</option>

                <option value="MACAPA; SANTANA, BRAZIL">
                  MACAPA; SANTANA, BRAZIL
                </option>

                <option value="MACASSAR, SULAWESI">MACASSAR, SULAWESI</option>

                <option value="MACEIO, BRAZ.">MACEIO, BRAZ.</option>

                <option value="MACKAY, AUSTRALIA">MACKAY, AUSTRALIA</option>

                <option value="MADRAS, INDIA">MADRAS, INDIA</option>

                <option value="MADRE DE DEUS, BRAZIL">
                  MADRE DE DEUS, BRAZIL
                </option>

                <option value="MAIZURU, JAPAN">MAIZURU, JAPAN</option>

                <option value="MAJORCA; PALMA DE MAJORCA, SP">
                  MAJORCA; PALMA DE MAJORCA, SP
                </option>

                <option value="MAKATEA, MAKATEA ISLANDS">
                  MAKATEA, MAKATEA ISLANDS
                </option>

                <option value="MALAGA, SPAIN">MALAGA, SPAIN</option>

                <option value="MALE, MALE ISLAND, MALDIVE">
                  MALE, MALE ISLAND, MALDIVE
                </option>

                <option value="MALMO; LIMHAMN, SWEDEN">
                  MALMO; LIMHAMN, SWEDEN
                </option>

                <option value="MALONGO OIL TERMINAL, ANGOLA">
                  MALONGO OIL TERMINAL, ANGOLA
                </option>

                <option value="MALTA (FREEPORT)">MALTA (FREEPORT)</option>

                <option value="MAMONAL, COL.">MAMONAL, COL.</option>

                <option value="MANAMA, BAHRAIN">MANAMA, BAHRAIN</option>

                <option value="MANAUS, BRAZ.">MANAUS, BRAZ.</option>

                <option value="MANCHESTER; ACTON GRANGE, ENG.">
                  MANCHESTER; ACTON GRANGE, ENG.
                </option>

                <option value="MANGONUI; MOUNT MAUNGANUI, N Z">
                  MANGONUI; MOUNT MAUNGANUI, N Z
                </option>

                <option value="MANILA NORTH, PHILIPPINES ">
                  MANILA NORTH, PHILIPPINES{" "}
                </option>

                <option value="MANILA SOUTH, PHILIPPINES">
                  MANILA SOUTH, PHILIPPINES
                </option>

                <option value="MANILA, PHILIPPINES">MANILA, PHILIPPINES</option>

                <option value="MANTA, ECU.">MANTA, ECU.</option>

                <option value="MANTYLUOTO, FIN.">MANTYLUOTO, FIN.</option>

                <option value="MANZANILLO BAY, DOM.REP">
                  MANZANILLO BAY, DOM.REP
                </option>

                <option value="MANZANILLO, (PUERTO) PANAMA">
                  MANZANILLO, (PUERTO) PANAMA
                </option>

                <option value="MANZANILLO, MEX.">MANZANILLO, MEX.</option>

                <option value="MANZANILLO, MEXICO">MANZANILLO, MEXICO</option>

                <option value="MAPUTO PORT, MOZAMBIQUE">
                  MAPUTO PORT, MOZAMBIQUE
                </option>

                <option value="MAPUTO, MOZAMBIQUE">MAPUTO, MOZAMBIQUE</option>

                <option value="MAR DEL PLATA, ARG.">MAR DEL PLATA, ARG.</option>

                <option value="MARACAIBO, VEN.">MARACAIBO, VEN.</option>

                <option value="MARATHON, ONT, CA.">MARATHON, ONT, CA.</option>

                <option value="MARDEJK, NETHERLANDS">
                  MARDEJK, NETHERLANDS
                </option>

                <option value="MARIGOT, ST. MARTIN, GUADELOUP">
                  MARIGOT, ST. MARTIN, GUADELOUP
                </option>

                <option value="MARIN, SPAIN">MARIN, SPAIN</option>

                <option value="MARINA DI CARRARA, ITALY">
                  MARINA DI CARRARA, ITALY
                </option>

                <option value="MARIUPOL; ZHDANOV, UKRAINE">
                  MARIUPOL; ZHDANOV, UKRAINE
                </option>

                <option value="MARIVELES, PHILIPPINES">
                  MARIVELES, PHILIPPINES
                </option>

                <option value="MARMAGAO BAY; GOA, INDIA">
                  MARMAGAO BAY; GOA, INDIA
                </option>

                <option value="MARPORT AMBRALI ISTANBUL ">
                  MARPORT AMBRALI ISTANBUL{" "}
                </option>

                <option value="MARPORT TERMINAL, AMBRALI ">
                  MARPORT TERMINAL, AMBRALI{" "}
                </option>

                <option value="MARQUESA ISLANDS">MARQUESA ISLANDS</option>

                <option value="MARSAXLOKK, MALTA">MARSAXLOKK, MALTA</option>

                <option value="MARSEILLE, FRANCE">MARSEILLE, FRANCE</option>

                <option value="MARYSTOWN, NFLD">MARYSTOWN, NFLD</option>

                <option value="MASAN, REP OF KOREA">MASAN, REP OF KOREA</option>

                <option value="MASERU, PHILLIPPINES">
                  MASERU, PHILLIPPINES
                </option>

                <option value="MASINLOC, PHILIPPINES">
                  MASINLOC, PHILIPPINES
                </option>

                <option value="MASIRAH, OMAN">MASIRAH, OMAN</option>

                <option value="MASSAWA; MASSAUA, ERITREA">
                  MASSAWA; MASSAUA, ERITREA
                </option>

                <option value="MASSET, BC">MASSET, BC</option>

                <option value="MATADI, ZAIRE">MATADI, ZAIRE</option>

                <option value="MATANZAS, VEN.">MATANZAS, VEN.</option>

                <option value="MATARANI, PERU">MATARANI, PERU</option>

                <option value="MATSUNAGA, JAPAN">MATSUNAGA, JAPAN</option>

                <option value="MATSUSHIMA, JAPAN">MATSUSHIMA, JAPAN</option>

                <option value="MATSUYAMA, JAPAN">MATSUYAMA, JAPAN</option>

                <option value="MAZATLAN, MEX.">MAZATLAN, MEX.</option>

                <option value="MCKENZIE, GUYANA">MCKENZIE, GUYANA</option>

                <option value="MELBOURNE">MELBOURNE</option>

                <option value="MELBOURNE, AUSTRALIA">
                  MELBOURNE, AUSTRALIA
                </option>

                <option value="MELBOURNE;YARRAVILLE,HASTINGAU">
                  MELBOURNE;YARRAVILLE,HASTINGAU
                </option>

                <option value="MELDRUM BAY, CANADA">MELDRUM BAY, CANADA</option>

                <option value="MEMEL; KLAIPEDA, LITHUANIA">
                  MEMEL; KLAIPEDA, LITHUANIA
                </option>

                <option value="MERAK, JAVA">MERAK, JAVA</option>

                <option value="MERSIN">MERSIN</option>

                <option value="MERSIN PORT, TURKEY ">
                  MERSIN PORT, TURKEY{" "}
                </option>

                <option value="MERSIN, TURKIYE ">MERSIN, TURKIYE </option>

                <option value="MERSIN,ADANA TURKEY">MERSIN,ADANA TURKEY</option>

                <option value="METEGTHAN,NS CANADA">METEGTHAN,NS CANADA</option>

                <option value="MICHIPICOTEN, ONT, CA.">
                  MICHIPICOTEN, ONT, CA.
                </option>

                <option value="MIDDLESBROUGH, ENGLAND">
                  MIDDLESBROUGH, ENGLAND
                </option>

                <option value="MIIKE, JAPAN">MIIKE, JAPAN</option>

                <option value="MILAZZO, ITALY">MILAZZO, ITALY</option>

                <option value="MILFORD HAVEN, WALES">
                  MILFORD HAVEN, WALES
                </option>

                <option value="MILITARY-GERMERSHEIM">
                  MILITARY-GERMERSHEIM
                </option>

                <option value="MILITARY-MANNHEIM, GERMANY">
                  MILITARY-MANNHEIM, GERMANY
                </option>

                <option value="MILITARY-NAHA, GERMANY">
                  MILITARY-NAHA, GERMANY
                </option>

                <option value="MILITARY-NAHA, JAPAN">
                  MILITARY-NAHA, JAPAN
                </option>

                <option value="MILITARY-YOKOHAMA, JAPAN">
                  MILITARY-YOKOHAMA, JAPAN
                </option>

                <option value="MILOS ISLAND, GREECE">
                  MILOS ISLAND, GREECE
                </option>

                <option value="MINA AL AHMADI;AL FUHAYHIL, KW">
                  MINA AL AHMADI;AL FUHAYHIL, KW
                </option>

                <option value="MINA AL FAHAL, OMAN">MINA AL FAHAL, OMAN</option>

                <option value="MINA SULMAN, BAHRAIN ISLAND">
                  MINA SULMAN, BAHRAIN ISLAND
                </option>

                <option value="MINA SUUD; MINA SAUD, KUWAIT">
                  MINA SUUD; MINA SAUD, KUWAIT
                </option>

                <option value="MINAMATA; UMEDO, JAPAN">
                  MINAMATA; UMEDO, JAPAN
                </option>

                <option value="MINATITLAN, MEX.">MINATITLAN, MEX.</option>

                <option value="MINDELO;PORTO GRANDE,CAPE VERD">
                  MINDELO;PORTO GRANDE,CAPE VERD
                </option>

                <option value="MIRAGOANE, HAITI">MIRAGOANE, HAITI</option>

                <option value="MIRI, MALAYSIA">MIRI, MALAYSIA</option>

                <option value="MISAMIS; PORT OZAMIS, PHIL.">
                  MISAMIS; PORT OZAMIS, PHIL.
                </option>

                <option value="MISHIMA KAWANOE,IYOSHIMA JAPAN">
                  MISHIMA KAWANOE,IYOSHIMA JAPAN
                </option>

                <option value="MISSION, BC, CANADA">MISSION, BC, CANADA</option>

                <option value="MISUMI, JAPAN">MISUMI, JAPAN</option>

                <option value="MITCHELL BAY, ONT CANADA">
                  MITCHELL BAY, ONT CANADA
                </option>

                <option value="MIYAKO, JAPAN">MIYAKO, JAPAN</option>

                <option value="MIZUSHIMA, JAPAN">MIZUSHIMA, JAPAN</option>

                <option value="MO I RANA, NORWAY">MO I RANA, NORWAY</option>

                <option value="MOANDA TERMINAL, ZAIRE">
                  MOANDA TERMINAL, ZAIRE
                </option>

                <option value="MOCHA;AL MOKHA, YEMEN REPUBLIC">
                  MOCHA;AL MOKHA, YEMEN REPUBLIC
                </option>

                <option value="MOENGO, SURINAME">MOENGO, SURINAME</option>

                <option value="MOERDJIK, NETHERLANDS">
                  MOERDJIK, NETHERLANDS
                </option>

                <option value="MOGADISCIO, SOMALIA">MOGADISCIO, SOMALIA</option>

                <option value="MOHAMMEDIA, MOROCC0">MOHAMMEDIA, MOROCC0</option>

                <option value="MOIN (LIMON)">MOIN (LIMON)</option>

                <option value="MOJI">MOJI</option>

                <option value="MOJI; MOGI, JAPAN">MOJI; MOGI, JAPAN</option>

                <option value="MOKPO; POHANG HANG, REP OF KOR">
                  MOKPO; POHANG HANG, REP OF KOR
                </option>

                <option value="MOLLENDO, PERU">MOLLENDO, PERU</option>

                <option value="MOMBASA, KENYA">MOMBASA, KENYA</option>

                <option value="MOMBASA, PORT OF KENYA ">
                  MOMBASA, PORT OF KENYA{" "}
                </option>

                <option value="MOMBASA; KILINDINI, KENYA">
                  MOMBASA; KILINDINI, KENYA
                </option>

                <option value="MONACO (MONTE CARLO)">
                  MONACO (MONTE CARLO)
                </option>

                <option value="MONEY POINT, IRELAND">
                  MONEY POINT, IRELAND
                </option>

                <option value="MONFALCONE, ITALY">MONFALCONE, ITALY</option>

                <option value="MONGSTAD, NORWAY">MONGSTAD, NORWAY</option>

                <option value="MONT LOUIS, QUE.  CA.">
                  MONT LOUIS, QUE. CA.
                </option>

                <option value="MONTAGUE, PEI, CA">MONTAGUE, PEI, CA</option>

                <option value="MONTEGO BAY, JAMAICA">
                  MONTEGO BAY, JAMAICA
                </option>

                <option value="MONTEVIDEO">MONTEVIDEO</option>

                <option value="MONTEVIDEO, URUGUAY">MONTEVIDEO, URUGUAY</option>

                <option value="MONTOIR, FRANCE">MONTOIR, FRANCE</option>

                <option value="MONTREAL">MONTREAL</option>

                <option value="MONTREAL CA - CANADA">
                  MONTREAL CA - CANADA
                </option>

                <option value="MONTREAL, CANADA ">MONTREAL, CANADA </option>

                <option value="MONTREAL, QC, CANADA ">
                  MONTREAL, QC, CANADA{" "}
                </option>

                <option value="MONTREAL, QUE">MONTREAL, QUE</option>

                <option value="MONTREAL, QUE, CA.">MONTREAL, QUE, CA.</option>

                <option value="MONTROSE, SCOTLAND">MONTROSE, SCOTLAND</option>

                <option value="MORON, VEN">MORON, VEN</option>

                <option value="MORRISBURG, ONTARIO">MORRISBURG, ONTARIO</option>

                <option value="MOSS, NORWAY">MOSS, NORWAY</option>

                <option value="MOTRIL, SPAIN">MOTRIL, SPAIN</option>

                <option value="MOTUKEA ISLAND">MOTUKEA ISLAND</option>

                <option value="MOUDI TERMINAL, CAMEROON">
                  MOUDI TERMINAL, CAMEROON
                </option>

                <option value="MOURILYAN HARBOUR">MOURILYAN HARBOUR</option>

                <option value="MOZAMBIQUE ISLAND, MOZAMBIQUE">
                  MOZAMBIQUE ISLAND, MOZAMBIQUE
                </option>

                <option value="MUARA PORT, BRUNEI">MUARA PORT, BRUNEI</option>

                <option value="MUDANYA; MUDANIA, TURKEY">
                  MUDANYA; MUDANIA, TURKEY
                </option>

                <option value="MULGRAVE, NS, CA">MULGRAVE, NS, CA</option>

                <option value="MUMBAI (BOMBAY), INDIA">
                  MUMBAI (BOMBAY), INDIA
                </option>

                <option value="MUMBAI PORT">MUMBAI PORT</option>

                <option value="MUMBAI PORT (INDIA)">MUMBAI PORT (INDIA)</option>

                <option value="MUMBAI PORTS">MUMBAI PORTS</option>

                <option value="MUMBAI SEAPORT ">MUMBAI SEAPORT </option>

                <option value="MUMBAI, INDIA">MUMBAI, INDIA</option>

                <option value="MUNDRA">MUNDRA</option>

                <option value="MUNDRA PORT, INDIA">MUNDRA PORT, INDIA</option>

                <option value="MUNDRA SEAPORT, INDIA">
                  MUNDRA SEAPORT, INDIA
                </option>

                <option value="MUNDRA, INDIA">MUNDRA, INDIA</option>

                <option value="MUNGA, ESTONIA">MUNGA, ESTONIA</option>

                <option value="MUNGUBA, BRAZIL">MUNGUBA, BRAZIL</option>

                <option value="MUNTOK, BANGKA">MUNTOK, BANGKA</option>

                <option value="MURORAN, JAPAN">MURORAN, JAPAN</option>

                <option value="MURRAY BAY, QUE">MURRAY BAY, QUE</option>

                <option value="MUSAYID; UMM SAID, QATAR">
                  MUSAYID; UMM SAID, QATAR
                </option>

                <option value="MUSCAT,OMAN">MUSCAT,OMAN</option>

                <option value="MUTANE, QUE, CA">MUTANE, QUE, CA</option>

                <option value="MUTSUI, JAPAN">MUTSUI, JAPAN</option>

                <option value="MYKONOS; MIKONOS, GREECE">
                  MYKONOS; MIKONOS, GREECE
                </option>

                <option value="MYTILINI; MITILINI, GREECE">
                  MYTILINI; MITILINI, GREECE
                </option>

                <option value="N ATLANTIC TNKR TRANS PT">
                  N ATLANTIC TNKR TRANS PT
                </option>

                <option value="N. PACIFIC TNKR TRANS PT">
                  N. PACIFIC TNKR TRANS PT
                </option>

                <option value="NAANTALI, FIN.">NAANTALI, FIN.</option>

                <option value="NACALA, MOZAMBIQUE">NACALA, MOZAMBIQUE</option>

                <option value="NADOR, MOROCCO">NADOR, MOROCCO</option>

                <option value="NAGASAKI, JAPAN">NAGASAKI, JAPAN</option>

                <option value="NAGOYA, JAPAN">NAGOYA, JAPAN</option>

                <option value="NAKSKOV, DENMARK">NAKSKOV, DENMARK</option>

                <option value="NAMIBE, ANGOLA">NAMIBE, ANGOLA</option>

                <option value="NANAIMO, HARMAC, BC, CA">
                  NANAIMO, HARMAC, BC, CA
                </option>

                <option value="NANJING">NANJING</option>

                <option value="NANKING, NANJING, CHINA M">
                  NANKING, NANJING, CHINA M
                </option>

                <option value="NANSHA">NANSHA</option>

                <option value="NANSHA, CHINA">NANSHA, CHINA</option>

                <option value="NANTES, FRANCE">NANTES, FRANCE</option>

                <option value="NANTICOKE, ONT, CA.">NANTICOKE, ONT, CA.</option>

                <option value="NANTONG, CHINA M">NANTONG, CHINA M</option>

                <option value="NAOETSU, JAPAN">NAOETSU, JAPAN</option>

                <option value="NAPIER, NEW ZEALAND">NAPIER, NEW ZEALAND</option>

                <option value="NAPLES">NAPLES</option>

                <option value="NAPLES; NAPOLI, ITALY">
                  NAPLES; NAPOLI, ITALY
                </option>

                <option value="NARVIK,BOGEN BAY, BOGEN NORWAY">
                  NARVIK,BOGEN BAY, BOGEN NORWAY
                </option>

                <option value="NASSAU, NEW PROV.ISL, BA">
                  NASSAU, NEW PROV.ISL, BA
                </option>

                <option value="NATAL, BRAZ.">NATAL, BRAZ.</option>

                <option value="NAURU ISLAND">NAURU ISLAND</option>

                <option value="NAVEGANTES PORT">NAVEGANTES PORT</option>

                <option value="NAVEGANTES, BRAZIL">NAVEGANTES, BRAZIL</option>

                <option value="NEATH, WALES">NEATH, WALES</option>

                <option value="NECOCHEA, ARGENTINA">NECOCHEA, ARGENTINA</option>

                <option value="NELSON, NEW ZEALAND">NELSON, NEW ZEALAND</option>

                <option value="NEMRUT BAY; ALIAGA TURKEY">
                  NEMRUT BAY; ALIAGA TURKEY
                </option>

                <option value="NESKAUPSTADUR, ICELAND">
                  NESKAUPSTADUR, ICELAND
                </option>

                <option value="NEW AMSTERDAM, GUYANA">
                  NEW AMSTERDAM, GUYANA
                </option>

                <option value="NEW MANGALORE;MANGALORE, INDIA">
                  NEW MANGALORE;MANGALORE, INDIA
                </option>

                <option value="NEW PLYMOUTH NEW ZEALAND">
                  NEW PLYMOUTH NEW ZEALAND
                </option>

                <option value="NEW WESTMINSTER, BC, CA.">
                  NEW WESTMINSTER, BC, CA.
                </option>

                <option value="NEWCASTLE ON TYNE, ENGLAND">
                  NEWCASTLE ON TYNE, ENGLAND
                </option>

                <option value="NEWCASTLE, AUS.">NEWCASTLE, AUS.</option>

                <option value="NEWCASTLE, NB, CA.">NEWCASTLE, NB, CA.</option>

                <option value="NEWHAVEN, ENGLAND">NEWHAVEN, ENGLAND</option>

                <option value="NEWPORT, ENGLAND">NEWPORT, ENGLAND</option>

                <option value="NEWPORT, WALES">NEWPORT, WALES</option>

                <option value="NHA TRANG, VIETNAM">NHA TRANG, VIETNAM</option>

                <option value="NHAVA SHEVA">NHAVA SHEVA</option>

                <option value="NHAVA SHEVA JNPT PORT INDIA">
                  NHAVA SHEVA JNPT PORT INDIA
                </option>

                <option value="NHAVA SHEVA PORT">NHAVA SHEVA PORT</option>

                <option value="NHAVA SHEVA PORT IN INDIA">
                  NHAVA SHEVA PORT IN INDIA
                </option>

                <option value="NHAVA SHEVA PORT,INDIA">
                  NHAVA SHEVA PORT,INDIA
                </option>

                <option value="NHAVA SHEVA SEA PORT">
                  NHAVA SHEVA SEA PORT
                </option>

                <option value="NHAVA SHEVA SEAPORT, INDIA">
                  NHAVA SHEVA SEAPORT, INDIA
                </option>

                <option value="NHAVA SHEVA, INDIA">NHAVA SHEVA, INDIA</option>

                <option value="NICE, FRANCE">NICE, FRANCE</option>

                <option value="NIGG BAY UNITED KINGDOM">
                  NIGG BAY UNITED KINGDOM
                </option>

                <option value="NIIGATA, JAPAN">NIIGATA, JAPAN</option>

                <option value="NIIHAMA, JAPAN">NIIHAMA, JAPAN</option>

                <option value="NING BO/NINGPO, CHINA M">
                  NING BO/NINGPO, CHINA M
                </option>

                <option value="NINGBO">NINGBO</option>

                <option value="NINGBO, CHINA">NINGBO, CHINA</option>

                <option value="NIUE ISLAND">NIUE ISLAND</option>

                <option value="NJARDVIK, ICELAND">NJARDVIK, ICELAND</option>

                <option value="NORDENHAM, FR GERMANY">
                  NORDENHAM, FR GERMANY
                </option>

                <option value="NORRESUNDBY, DENMARK">
                  NORRESUNDBY, DENMARK
                </option>

                <option value="NORRKOPING, SWEDEN">NORRKOPING, SWEDEN</option>

                <option value="NORRSUNDET, SWEDEN">NORRSUNDET, SWEDEN</option>

                <option value="NORTH SYDNEY, NS">NORTH SYDNEY, NS</option>

                <option value="NOUMEA, NEW CALEDONIA">
                  NOUMEA, NEW CALEDONIA
                </option>

                <option value="NOVIGRAD, CROATIA">NOVIGRAD, CROATIA</option>

                <option value="NSICT,INDIA">NSICT,INDIA</option>

                <option value="NUEVA PALMIRA, URUGUAY">
                  NUEVA PALMIRA, URUGUAY
                </option>

                <option value="NUEVO LAREDO, MEX.">NUEVO LAREDO, MEX.</option>

                <option value="NYBORG, DENMARK">NYBORG, DENMARK</option>

                <option value="NYKOBING, DENMARK">NYKOBING, DENMARK</option>

                <option value="OAK BAY, BC CANADA">OAK BAY, BC CANADA</option>

                <option value="OAKHAM NESS, ENGLAND">
                  OAKHAM NESS, ENGLAND
                </option>

                <option value="OAKVILLE, ONT, CA.">OAKVILLE, ONT, CA.</option>

                <option value="OBBOLA, SWEDEN">OBBOLA, SWEDEN</option>

                <option value="OBIDOS, BRAZIL">OBIDOS, BRAZIL</option>

                <option value="OBRAVAC, CROATIA">OBRAVAC, CROATIA</option>

                <option value="OCEAN CAY">OCEAN CAY</option>

                <option value="OCHO RIOS, JAM.">OCHO RIOS, JAM.</option>

                <option value="ODENSE, DENMARK">ODENSE, DENMARK</option>

                <option value="OFUNATO, JAPAN">OFUNATO, JAPAN</option>

                <option value="OGUENDJO TERMINAL, GABON">
                  OGUENDJO TERMINAL, GABON
                </option>

                <option value="OISTINO, BARBADOS">OISTINO, BARBADOS</option>

                <option value="OITA, JAPAN">OITA, JAPAN</option>

                <option value="OJIBWAY, ONT, CA.">OJIBWAY, ONT, CA.</option>

                <option value="OKINAWA ISLAND">OKINAWA ISLAND</option>

                <option value="OKPO, KOREA">OKPO, KOREA</option>

                <option value="ONAGAWA, JAPAN">ONAGAWA, JAPAN</option>

                <option value="ONAHAMA, JAPAN">ONAHAMA, JAPAN</option>

                <option value="ORAN; WAHRAN, ALGERIA">
                  ORAN; WAHRAN, ALGERIA
                </option>

                <option value="ORANGESTAD;PAARDEN BAY,ARUBA I">
                  ORANGESTAD;PAARDEN BAY,ARUBA I
                </option>

                <option value="ORANJESTAD, ARUBA ">ORANJESTAD, ARUBA </option>

                <option value="ORNSKOLDSVIK, SWEDEN">
                  ORNSKOLDSVIK, SWEDEN
                </option>

                <option value="OSAKA">OSAKA</option>

                <option value="OSAKA, JAPAN">OSAKA, JAPAN</option>

                <option value="OSAKA, MISAKI, JAPAN">
                  OSAKA, MISAKI, JAPAN
                </option>

                <option value="OSHAWA, ONT, CA">OSHAWA, ONT, CA</option>

                <option value="OSKARSHAMN, SWEDEN">OSKARSHAMN, SWEDEN</option>

                <option value="OSLO, NORWAY">OSLO, NORWAY</option>

                <option value="OSLO; LYSAKER, NORWAY">
                  OSLO; LYSAKER, NORWAY
                </option>

                <option value="OSTEND, BELGIUM">OSTEND, BELGIUM</option>

                <option value="OTARU, JAPAN">OTARU, JAPAN</option>

                <option value="OTH HOND W COAST REG PTS">
                  OTH HOND W COAST REG PTS
                </option>

                <option value="OTTAWA, ONT, CA.">OTTAWA, ONT, CA.</option>

                <option value="OTTER ISLAND, ONT CANADA">
                  OTTER ISLAND, ONT CANADA
                </option>

                <option value="OULU/ULEABORG, FINLAND">
                  OULU/ULEABORG, FINLAND
                </option>

                <option value="OWEN SOUND, ONT">OWEN SOUND, ONT</option>

                <option value="OWENDO">OWENDO</option>

                <option value="OXELOSUND, SWEDEN">OXELOSUND, SWEDEN</option>

                <option value="PADANG; TELUK BAYUR, SUMATRA">
                  PADANG; TELUK BAYUR, SUMATRA
                </option>

                <option value="PAITA, PERU">PAITA, PERU</option>

                <option value="PAJARITOS, MEX">PAJARITOS, MEX</option>

                <option value="PALAMOS, SPAIN">PALAMOS, SPAIN</option>

                <option value="PALANCA TERMINAL, ANGOLA">
                  PALANCA TERMINAL, ANGOLA
                </option>

                <option value="PALAU (PELEW) ISLANDS">
                  PALAU (PELEW) ISLANDS
                </option>

                <option value="PALEMBANG, SUMATRA">PALEMBANG, SUMATRA</option>

                <option value="PALERMO, ITALY">PALERMO, ITALY</option>

                <option value="PALUA, VEN.">PALUA, VEN.</option>

                <option value="PANAMA CANAL - CARIBBEAN, COLON, CANAL-CARIB. ">
                  PANAMA CANAL - CARIBBEAN, COLON, CANAL-CARIB.{" "}
                </option>

                <option value="PANAMACTY,PANAMACANAL-PAC PA">
                  PANAMACTY,PANAMACANAL-PAC PA
                </option>

                <option value="PANARUKAN, JAVA">PANARUKAN, JAVA</option>

                <option value="PANDJANG, SUMATRA">PANDJANG, SUMATRA</option>

                <option value="PANGKALAN SUSU, SUMATRA">
                  PANGKALAN SUSU, SUMATRA
                </option>

                <option value="PANGKOL, BANGKA">PANGKOL, BANGKA</option>

                <option value="PANTOLOAN, PALU INDONESIA">
                  PANTOLOAN, PALU INDONESIA
                </option>

                <option value="PARADIP, INDIA">PARADIP, INDIA</option>

                <option value="PARAMARIBO">PARAMARIBO</option>

                <option value="PARAMARIBO;SMALKALDEN,SURINAME">
                  PARAMARIBO;SMALKALDEN,SURINAME
                </option>

                <option value="PARANAGUA">PARANAGUA</option>

                <option value="PARANAGUA, BRAZIL">PARANAGUA, BRAZIL</option>

                <option value="PARANAGUA;ANTONINA, BRAZIL">
                  PARANAGUA;ANTONINA, BRAZIL
                </option>

                <option value="PARANAM, SURINAME">PARANAM, SURINAME</option>

                <option value="PARNAIBA, BRAZ.">PARNAIBA, BRAZ.</option>

                <option value="PARRY SOUND, ONT, CA.">
                  PARRY SOUND, ONT, CA.
                </option>

                <option value="PASAGES; PASAJES, SPAIN">
                  PASAGES; PASAJES, SPAIN
                </option>

                <option value="PASIR GUDANG">PASIR GUDANG</option>

                <option value="PASIR GUDANG, JOHOR, MALAYSIA">
                  PASIR GUDANG, JOHOR, MALAYSIA
                </option>

                <option value="PASIR GUDANG, MALAYSIA">
                  PASIR GUDANG, MALAYSIA
                </option>

                <option value="PATILLOS;CALETA PATILLOS,CHILE">
                  PATILLOS;CALETA PATILLOS,CHILE
                </option>

                <option value="PATRAI; PATRAS, GREECE">
                  PATRAI; PATRAS, GREECE
                </option>

                <option value="PAUILLAC, FRANCE">PAUILLAC, FRANCE</option>

                <option value="PECEM">PECEM</option>

                <option value="PECEM, BRAZIL">PECEM, BRAZIL</option>

                <option value="PECEM,POCERN, PRT DO PECERCN, BRAZ.">
                  PECEM,POCERN, PRT DO PECERCN, BRAZ.
                </option>

                <option value="PEDREGAL, PAN.">PEDREGAL, PAN.</option>

                <option value="PELEE ISLAND;SCUDDER,ONT.CA">
                  PELEE ISLAND;SCUDDER,ONT.CA
                </option>

                <option value="PEMBROKE, WALES">PEMBROKE, WALES</option>

                <option value="PENANG">PENANG</option>

                <option value="PENANG, MALAYSIA">PENANG, MALAYSIA</option>

                <option value="PENANG; PINANG, MALAYSIA">
                  PENANG; PINANG, MALAYSIA
                </option>

                <option value="PENCO">PENCO</option>

                <option value="PENNINGTON, NIGERIA">PENNINGTON, NIGERIA</option>

                <option value="PENRHYN ATOLL, COOK IS.">
                  PENRHYN ATOLL, COOK IS.
                </option>

                <option value="PERNIS, NETHERLANDS">PERNIS, NETHERLANDS</option>

                <option value="PERTH, AUS.">PERTH, AUS.</option>

                <option value="PERTIGALETE, VENEZUELA">
                  PERTIGALETE, VENEZUELA
                </option>

                <option value="PETERHEAD, UNITED KINGDOM">
                  PETERHEAD, UNITED KINGDOM
                </option>

                <option value="PETIT GOAVE, HAITI">PETIT GOAVE, HAITI</option>

                <option value="PHILIPSBURGH/PHILIPSBOROUGH,NA">
                  PHILIPSBURGH/PHILIPSBOROUGH,NA
                </option>

                <option value="PHUKET; BAN THA RUA, THAILAND">
                  PHUKET; BAN THA RUA, THAILAND
                </option>

                <option value="PICTON, ONT, CA.">PICTON, ONT, CA.</option>

                <option value="PICTOU, NS">PICTOU, NS</option>

                <option value="PILOS; PYLOS, GREECE">
                  PILOS; PYLOS, GREECE
                </option>

                <option value="PIMENTEL, PERU">PIMENTEL, PERU</option>

                <option value="PIOMBINO, ITALY">PIOMBINO, ITALY</option>

                <option value="PIPAVAV PORT, INDIA ">
                  PIPAVAV PORT, INDIA{" "}
                </option>

                <option value="PIPAVAV, INDIA">PIPAVAV, INDIA</option>

                <option value="PIRAEUS">PIRAEUS</option>

                <option value="PIRAIEUS; PIRAEUS, GREECE">
                  PIRAIEUS; PIRAEUS, GREECE
                </option>

                <option value="PIRAN; PIRANO, SLOVENIA">
                  PIRAN; PIRANO, SLOVENIA
                </option>

                <option value="PISCO;GENERAL SAN MARTIN, PERU">
                  PISCO;GENERAL SAN MARTIN, PERU
                </option>

                <option value="PLADJU, SUMATRA">PLADJU, SUMATRA</option>

                <option value="PLOCE, CROATIA">PLOCE, CROATIA</option>

                <option value="PLYMOUTH, ENGLAND">PLYMOUTH, ENGLAND</option>

                <option value="PLYMOUTH, MONTSERRAT">
                  PLYMOUTH, MONTSERRAT
                </option>

                <option value="POHANG;POHANG HANG,REP. OF KOR">
                  POHANG;POHANG HANG,REP. OF KOR
                </option>

                <option value="POHNPEI/PONAPE, CAR IS MICRONS">
                  POHNPEI/PONAPE, CAR IS MICRONS
                </option>

                <option value="POINT A PIERRE, TRINIDAD">
                  POINT A PIERRE, TRINIDAD
                </option>

                <option value="POINT AU PIC, QUE">POINT AU PIC, QUE</option>

                <option value="POINT FORTIN, TRINIDAD">
                  POINT FORTIN, TRINIDAD
                </option>

                <option value="POINT LISAS, TRINIDAD">
                  POINT LISAS, TRINIDAD
                </option>

                <option value="POINT TUPPER, CBI, CA">
                  POINT TUPPER, CBI, CA
                </option>

                <option value="POINT UBU, BRAZIL">POINT UBU, BRAZIL</option>

                <option value="POINTE A PITRE, GUADELOUPE">
                  POINTE A PITRE, GUADELOUPE
                </option>

                <option value="POINTE AUX TREMBLES,ONT CANADA">
                  POINTE AUX TREMBLES,ONT CANADA
                </option>

                <option value="POINTE DES GALETS, REUNION">
                  POINTE DES GALETS, REUNION
                </option>

                <option value="POLICE, POLAND">POLICE, POLAND</option>

                <option value="PONTA DA MADEIRA, BRAZIL">
                  PONTA DA MADEIRA, BRAZIL
                </option>

                <option value="PONTA DELGADA, AZORES">
                  PONTA DELGADA, AZORES
                </option>

                <option value="PONTIANAK, KALIMANTAN">
                  PONTIANAK, KALIMANTAN
                </option>

                <option value="PORSGRUNN, NORWAY">PORSGRUNN, NORWAY</option>

                <option value="PORT ALFRED, QUE, CA.">
                  PORT ALFRED, QUE, CA.
                </option>

                <option value="PORT ALICE, BC, CA.">PORT ALICE, BC, CA.</option>

                <option value="PORT ALMA, AUS.">PORT ALMA, AUS.</option>

                <option value="PORT AU PRINCE, HAITI">
                  PORT AU PRINCE, HAITI
                </option>

                <option value="PORT CAMPHA; CAM PHA, VIET NAM">
                  PORT CAMPHA; CAM PHA, VIET NAM
                </option>

                <option value="PORT CARTIER, QUE, CA.">
                  PORT CARTIER, QUE, CA.
                </option>

                <option value="PORT CHALMERS, NEW ZEAL">
                  PORT CHALMERS, NEW ZEAL
                </option>

                <option value="PORT CLEMENTS, BC">PORT CLEMENTS, BC</option>

                <option value="PORT COLBORNE;CAYUGA,ONT,CA">
                  PORT COLBORNE;CAYUGA,ONT,CA
                </option>

                <option value="PORT CREDIT, ONT, CA.">
                  PORT CREDIT, ONT, CA.
                </option>

                <option value="PORT DE BOUC; CARONTE, FRANCE">
                  PORT DE BOUC; CARONTE, FRANCE
                </option>

                <option value="PORT DE PAIX, HAITI">PORT DE PAIX, HAITI</option>

                <option value="PORT DICKSON, MALAYSIA">
                  PORT DICKSON, MALAYSIA
                </option>

                <option value="PORT ELIZABETH,REP.S.AFR">
                  PORT ELIZABETH,REP.S.AFR
                </option>

                <option value="PORT ETIENNE, MAURITANIA">
                  PORT ETIENNE, MAURITANIA
                </option>

                <option value="PORT GENTIL, GABON">PORT GENTIL, GABON</option>

                <option value="PORT HARCOURT, NIGERIA">
                  PORT HARCOURT, NIGERIA
                </option>

                <option value="PORT HARDY, BC">PORT HARDY, BC</option>

                <option value="PORT HAWKESBURY, NS">PORT HAWKESBURY, NS</option>

                <option value="PORT HEDLAND, AUSTRALIA">
                  PORT HEDLAND, AUSTRALIA
                </option>

                <option value="PORT HESS, VI">PORT HESS, VI</option>

                <option value="PORT JEROME, FRANCE">PORT JEROME, FRANCE</option>

                <option value="PORT KAISER, JAM.">PORT KAISER, JAM.</option>

                <option value="PORT KANDLA;KANDLA, INDIA">
                  PORT KANDLA;KANDLA, INDIA
                </option>

                <option value="PORT KELANG, MALAYSIA">
                  PORT KELANG, MALAYSIA
                </option>

                <option value="PORT KEMBLA, AUS.">PORT KEMBLA, AUS.</option>

                <option value="PORT KLANG">PORT KLANG</option>

                <option value="PORT KLANG, MALAYSIA">
                  PORT KLANG, MALAYSIA
                </option>

                <option value="PORT LIMON, COSTA RICA">
                  PORT LIMON, COSTA RICA
                </option>

                <option value="PORT LOUIS, MAURITIUS">
                  PORT LOUIS, MAURITIUS
                </option>

                <option value="PORT LUCAYA, BAHAMAS">
                  PORT LUCAYA, BAHAMAS
                </option>

                <option value="PORT MAITLAND, NS CANADA">
                  PORT MAITLAND, NS CANADA
                </option>

                <option value="PORT MANN, BC, CA.">PORT MANN, BC, CA.</option>

                <option value="PORT MELLON, BC.  CA.">
                  PORT MELLON, BC. CA.
                </option>

                <option value="PORT MOODY, BC, CA.">PORT MOODY, BC, CA.</option>

                <option value="PORT MORESBY, NEW GUINEA">
                  PORT MORESBY, NEW GUINEA
                </option>

                <option value="PORT MUHAMMAD BIN QASIM, PAKIS">
                  PORT MUHAMMAD BIN QASIM, PAKIS
                </option>

                <option value="PORT OF ITAGUAI">PORT OF ITAGUAI</option>

                <option value="PORT OF SHATIAN, CHINA">
                  PORT OF SHATIAN, CHINA
                </option>

                <option value="PORT OF SPAIN">PORT OF SPAIN</option>

                <option value="PORT OF SPAIN, TRINIDAD">
                  PORT OF SPAIN, TRINIDAD
                </option>

                <option value="PORT OF SPAIN, TRINIDAD &amp; TOBAGO ">
                  PORT OF SPAIN, TRINIDAD &amp; TOBAGO{" "}
                </option>

                <option value="PORT PIRIE, AUS.">PORT PIRIE, AUS.</option>

                <option value="PORT QASIM">PORT QASIM</option>

                <option value="PORT RHOADES, JAM.">PORT RHOADES, JAM.</option>

                <option value="PORT SAID">PORT SAID</option>

                <option value="PORT SAID, EGYPT">PORT SAID, EGYPT</option>

                <option value="PORT SAINT LOUIS, FRANCE">
                  PORT SAINT LOUIS, FRANCE
                </option>

                <option value="PORT SIMPSON, BC">PORT SIMPSON, BC</option>

                <option value="PORT STANLEY, ONT, CA.">
                  PORT STANLEY, ONT, CA.
                </option>

                <option value="PORT TALBOT, WALES">PORT TALBOT, WALES</option>

                <option value="PORT VILA, EFATE IS, VANUATU">
                  PORT VILA, EFATE IS, VANUATU
                </option>

                <option value="PORT WELLER, ONT.  CA.">
                  PORT WELLER, ONT. CA.
                </option>

                <option value="PORTBURY,  ENGLAND">PORTBURY, ENGLAND</option>

                <option value="PORTEDWARD,BC,WATSONISL BC CA">
                  PORTEDWARD,BC,WATSONISL BC CA
                </option>

                <option value="PORTLAND, AUSTRAL">PORTLAND, AUSTRAL</option>

                <option value="PORTO ALEGRE;SANTA CLARA, BRAZ">
                  PORTO ALEGRE;SANTA CLARA, BRAZ
                </option>

                <option value="PORTO EMPEDOCLE, ITALY">
                  PORTO EMPEDOCLE, ITALY
                </option>

                <option value="PORTO TORRES, ITALY">PORTO TORRES, ITALY</option>

                <option value="PORTO VESME;PORTOCUSO, ITALY">
                  PORTO VESME;PORTOCUSO, ITALY
                </option>

                <option value="PORTO; OPORTO, PORTUGAL">
                  PORTO; OPORTO, PORTUGAL
                </option>

                <option value="PORTOBELO, PAN.">PORTOBELO, PAN.</option>

                <option value="PORTSMOUTH, DOMINICA ISLAND">
                  PORTSMOUTH, DOMINICA ISLAND
                </option>

                <option value="POTI, GEORGIA">POTI, GEORGIA</option>

                <option value="POWELL RIVER, BC, CA.">
                  POWELL RIVER, BC, CA.
                </option>

                <option value="PRAIA/PRAIA DE VITORIA, AZORES">
                  PRAIA/PRAIA DE VITORIA, AZORES
                </option>

                <option value="PRAIA; PORTO PRAIA, CAPE VERDE">
                  PRAIA; PORTO PRAIA, CAPE VERDE
                </option>

                <option value="PRESCOTT;PT JOHNSTWN,ONT,CA">
                  PRESCOTT;PT JOHNSTWN,ONT,CA
                </option>

                <option value="PRESTON, ENGLAND">PRESTON, ENGLAND</option>

                <option value="PRINCE RUPERT, BC, CA.">
                  PRINCE RUPERT, BC, CA.
                </option>

                <option value="PRIOLO, ITALY">PRIOLO, ITALY</option>

                <option value="PROGRESO, MEX.">PROGRESO, MEX.</option>

                <option value="PROVIDENCIALES, TURKS CAICOS I">
                  PROVIDENCIALES, TURKS CAICOS I
                </option>

                <option value="PSACHNA, GREECE">PSACHNA, GREECE</option>

                <option value="PTP PORT, MALAYSIA ">PTP PORT, MALAYSIA </option>

                <option value="PUERTO ARMUELLES, PAN.">
                  PUERTO ARMUELLES, PAN.
                </option>

                <option value="PUERTO BARRIOS,GUATEMALA">
                  PUERTO BARRIOS,GUATEMALA
                </option>

                <option value="PUERTO BOLIVAR, COLOMB">
                  PUERTO BOLIVAR, COLOMB
                </option>

                <option value="PUERTO BOLIVAR, ECU.">
                  PUERTO BOLIVAR, ECU.
                </option>

                <option value="PUERTO CABELLO, VEN.">
                  PUERTO CABELLO, VEN.
                </option>

                <option value="PUERTO CABEZAS, NICAR.">
                  PUERTO CABEZAS, NICAR.
                </option>

                <option value="PUERTO CASTILLA, HOND.">
                  PUERTO CASTILLA, HOND.
                </option>

                <option value="PUERTO COLOMBIA, COL.">
                  PUERTO COLOMBIA, COL.
                </option>

                <option value="PUERTO CORTES, HOND.">
                  PUERTO CORTES, HOND.
                </option>

                <option value="PUERTO CORTES, HONDURAS HN">
                  PUERTO CORTES, HONDURAS HN
                </option>

                <option value="PUERTO DESEADO, ARGENT">
                  PUERTO DESEADO, ARGENT
                </option>

                <option value="PUERTO HENECAN, HOND.">
                  PUERTO HENECAN, HOND.
                </option>

                <option value="PUERTO LA CRUZ, VENEZ">
                  PUERTO LA CRUZ, VENEZ
                </option>

                <option value="PUERTO LIMON">PUERTO LIMON</option>

                <option value="PUERTO LIMON, COSTA RICA">
                  PUERTO LIMON, COSTA RICA
                </option>

                <option value="PUERTO MADRYN, ARGENT">
                  PUERTO MADRYN, ARGENT
                </option>

                <option value="PUERTO MEXICO, MEX.">PUERTO MEXICO, MEX.</option>

                <option value="PUERTO MIRANDA, VEN.">
                  PUERTO MIRANDA, VEN.
                </option>

                <option value="PUERTO MORALES, MEX.">
                  PUERTO MORALES, MEX.
                </option>

                <option value="PUERTO NUEVO, ECU.">PUERTO NUEVO, ECU.</option>

                <option value="PUERTO ORDAZ, VEN.">PUERTO ORDAZ, VEN.</option>

                <option value="PUERTO PLATA, DOM. REP.">
                  PUERTO PLATA, DOM. REP.
                </option>

                <option value="PUERTO QUETZAL, GUATEMALA">
                  PUERTO QUETZAL, GUATEMALA
                </option>

                <option value="PUERTO SUCRE,CUMANA, VEN">
                  PUERTO SUCRE,CUMANA, VEN
                </option>

                <option value="PUERTO VALLARTA, MEX">
                  PUERTO VALLARTA, MEX
                </option>

                <option value="PULA, POLA, CROATIA">PULA, POLA, CROATIA</option>

                <option value="PULAU SAMBU, RIOW ISLANDS">
                  PULAU SAMBU, RIOW ISLANDS
                </option>

                <option value="PULUM BUKUM, SINGAPORE">
                  PULUM BUKUM, SINGAPORE
                </option>

                <option value="PULUPANDAN, PHILIPPINES">
                  PULUPANDAN, PHILIPPINES
                </option>

                <option value="PUNTA ARENAS, CHILE">PUNTA ARENAS, CHILE</option>

                <option value="PUNTA CARDON, VEN.">PUNTA CARDON, VEN.</option>

                <option value="PUNTA CUCHILLO, VENEZUELA">
                  PUNTA CUCHILLO, VENEZUELA
                </option>

                <option value="PUNTA DEL ESTE, URUGUAY">
                  PUNTA DEL ESTE, URUGUAY
                </option>

                <option value="PUNTA MORALES, COSTA RICA">
                  PUNTA MORALES, COSTA RICA
                </option>

                <option value="PUNTA PALMAS, VENEZUELA">
                  PUNTA PALMAS, VENEZUELA
                </option>

                <option value="PUNTA QUEPOS, COSTA RICA">
                  PUNTA QUEPOS, COSTA RICA
                </option>

                <option value="PUNTARENAS, COSTA RICA">
                  PUNTARENAS, COSTA RICA
                </option>

                <option value="PURTO LIMON, COSTA RICA">
                  PURTO LIMON, COSTA RICA
                </option>

                <option value="PUSAN ">PUSAN </option>

                <option value="PUSAN; BUSAN, REP. OF KOREA">
                  PUSAN; BUSAN, REP. OF KOREA
                </option>

                <option value="PYONGTAEK, PYUNGTAEK S. KOREA">
                  PYONGTAEK, PYUNGTAEK S. KOREA
                </option>

                <option value="QALHAT, OMAN">QALHAT, OMAN</option>

                <option value="QINGDAO">QINGDAO</option>

                <option value="QINGDAO CHINA">QINGDAO CHINA</option>

                <option value="QINGDAO PORT">QINGDAO PORT</option>

                <option value="QINGDAO PORT,CHINA">QINGDAO PORT,CHINA</option>

                <option value="QINGDAO SEAPORT">QINGDAO SEAPORT</option>

                <option value="QINGDAO, CHINA">QINGDAO, CHINA</option>

                <option value="QINGDAO,CHINA">QINGDAO,CHINA</option>

                <option value="QINZHOU, CHINA">QINZHOU, CHINA</option>

                <option value="QUEBEC, QUE, CA.">QUEBEC, QUE, CA.</option>

                <option value="QUINGDAO, CHINA: TSINGTAO">
                  QUINGDAO, CHINA: TSINGTAO
                </option>

                <option value="QUINTERO, CHILE">QUINTERO, CHILE</option>

                <option value="QUY NHON, VIETNAM">QUY NHON, VIETNAM</option>

                <option value="RAAHE, FINLAND">RAAHE, FINLAND</option>

                <option value="RABAUL, NEW GUINEA">RABAUL, NEW GUINEA</option>

                <option value="RADICATEL, FRANCE">RADICATEL, FRANCE</option>

                <option value="RAGGED ISL,DUNCAN TOWN BAHAMAS">
                  RAGGED ISL,DUNCAN TOWN BAHAMAS
                </option>

                <option value="RAMA,ARLEN SIU, NICARAGUA">
                  RAMA,ARLEN SIU, NICARAGUA
                </option>

                <option value="RAMEA, NFLD">RAMEA, NFLD</option>

                <option value="RANDERS, DENMARK">RANDERS, DENMARK</option>

                <option value="RAS AT TANNURAH,SAUD AR.">
                  RAS AT TANNURAH,SAUD AR.
                </option>

                <option value="RAS GHARIB">RAS GHARIB</option>

                <option value="RAS LAFFAN, QATAR">RAS LAFFAN, QATAR</option>

                <option value="RAS SHUKHEIR, EGYPT">RAS SHUKHEIR, EGYPT</option>

                <option value="RAS SUDR, EGYPT">RAS SUDR, EGYPT</option>

                <option value="RAUMA, FINLAND">RAUMA, FINLAND</option>

                <option value="RAVENNA">RAVENNA</option>

                <option value="RAVENNA ITALIAN PORT">
                  RAVENNA ITALIAN PORT
                </option>

                <option value="RAVENNA SEAPORT IN ITALY ">
                  RAVENNA SEAPORT IN ITALY{" "}
                </option>

                <option value="RAVENNA, ITALY ">RAVENNA, ITALY </option>

                <option value="RAVENNA; PORTO CORSINI, ITALY">
                  RAVENNA; PORTO CORSINI, ITALY
                </option>

                <option value="RAYONG, MAP TA PHUT THAILAND">
                  RAYONG, MAP TA PHUT THAILAND
                </option>

                <option value="RECIFE; PERNAMBUCO, BRAZIL">
                  RECIFE; PERNAMBUCO, BRAZIL
                </option>

                <option value="REDCAR,  ENGLAND">REDCAR, ENGLAND</option>

                <option value="REKEFJORD, NORWAY">REKEFJORD, NORWAY</option>

                <option value="REY MALABO; SANTA ISABEL,EQ GU">
                  REY MALABO; SANTA ISABEL,EQ GU
                </option>

                <option value="REYKJAVIK, ICEL.">REYKJAVIK, ICEL.</option>

                <option value="RICHARDS BAY, REP SAF">
                  RICHARDS BAY, REP SAF
                </option>

                <option value="RICHARDSON, NB">RICHARDSON, NB</option>

                <option value="RICHMOND, BC, CA">RICHMOND, BC, CA</option>

                <option value="RIGA, LATVIA">RIGA, LATVIA</option>

                <option value="RIJEKA PORT">RIJEKA PORT</option>

                <option value="RIJEKA, CROATIA">RIJEKA, CROATIA</option>

                <option value="RIJEKA, FIUME, BAKAR, CROATIA">
                  RIJEKA, FIUME, BAKAR, CROATIA
                </option>

                <option value="RIMOUSKI, QUE, CA">RIMOUSKI, QUE, CA</option>

                <option value="RIO DE GRANDE, BRAZIL">
                  RIO DE GRANDE, BRAZIL
                </option>

                <option value="RIO DE JANEIRO">RIO DE JANEIRO</option>

                <option value="RIO DE JANEIRO, BRAZIL">
                  RIO DE JANEIRO, BRAZIL
                </option>

                <option value="RIO DE JANEIRO; NITEROI, BRAZ.">
                  RIO DE JANEIRO; NITEROI, BRAZ.
                </option>

                <option value="RIO GRANDE PORT">RIO GRANDE PORT</option>

                <option value="RIO GRANDE, BRAZIL">RIO GRANDE, BRAZIL</option>

                <option value="RIO HAINA">RIO HAINA</option>

                <option value="RIO JAINA, RIO HAINA, JAINA, HAINA, DOM REP">
                  RIO JAINA, RIO HAINA, JAINA, HAINA, DOM REP
                </option>

                <option value="RIZHAO, CHINA MAINLAND">
                  RIZHAO, CHINA MAINLAND
                </option>

                <option value="ROATAN, HOND.">ROATAN, HOND.</option>

                <option value="ROBERTS BANK, BC, CA">
                  ROBERTS BANK, BC, CA
                </option>

                <option value="ROCHEFORT, FRANCE">ROCHEFORT, FRANCE</option>

                <option value="ROCKPORT, ONTARIO">ROCKPORT, ONTARIO</option>

                <option value="ROCKY POINT, JAM.">ROCKY POINT, JAM.</option>

                <option value="ROCKY POINT, ONT, CA">
                  ROCKY POINT, ONT, CA
                </option>

                <option value="RODMAN, PANAMA">RODMAN, PANAMA</option>

                <option value="RONNE, DENMARK">RONNE, DENMARK</option>

                <option value="RONNSKER,  SWEDEN">RONNSKER, SWEDEN</option>

                <option value="ROSARIO, ARG.">ROSARIO, ARG.</option>

                <option value="ROSARITO, MEX.">ROSARITO, MEX.</option>

                <option value="ROSEAU, DOMINICA ISLAND">
                  ROSEAU, DOMINICA ISLAND
                </option>

                <option value="ROSTOCK, FR GERMANY">ROSTOCK, FR GERMANY</option>

                <option value="ROTTERDAM">ROTTERDAM</option>

                <option value="ROTTERDAM PORT">ROTTERDAM PORT</option>

                <option value="ROTTERDAM PORT, NETHERLANDS">
                  ROTTERDAM PORT, NETHERLANDS
                </option>

                <option value="ROTTERDAM, EUROPEAN SEAPORT ">
                  ROTTERDAM, EUROPEAN SEAPORT{" "}
                </option>

                <option value="ROTTERDAM, NETHERLANDS">
                  ROTTERDAM, NETHERLANDS
                </option>

                <option value="ROTTERDAM,EUROPEAN UNION PORT">
                  ROTTERDAM,EUROPEAN UNION PORT
                </option>

                <option value="ROUEN, FRANCE">ROUEN, FRANCE</option>

                <option value="RUM CAY,PORT NELSON BAHAMAS">
                  RUM CAY,PORT NELSON BAHAMAS
                </option>

                <option value="RUMOI, JAPAN">RUMOI, JAPAN</option>

                <option value="RUPERT INLET, QUE">RUPERT INLET, QUE</option>

                <option value="S ATLANTIC TNKR TRANS PT">
                  S ATLANTIC TNKR TRANS PT
                </option>

                <option value="S. PACIFIC TNKR TRANS PT">
                  S. PACIFIC TNKR TRANS PT
                </option>

                <option value="SAFAGA, EGYPT">SAFAGA, EGYPT</option>

                <option value="SAFFI, SAFI, MOROCCO">
                  SAFFI, SAFI, MOROCCO
                </option>

                <option value="SAGUNTO; PUERTO DE SAGUNTO, SP">
                  SAGUNTO; PUERTO DE SAGUNTO, SP
                </option>

                <option value="SAIKI, JAPAN">SAIKI, JAPAN</option>

                <option value="SAIMAA CANAL, FINLAND">
                  SAIMAA CANAL, FINLAND
                </option>

                <option value="SAINT ANDREWS, NB">SAINT ANDREWS, NB</option>

                <option value="SAINT ANTHONY, NFLD">SAINT ANTHONY, NFLD</option>

                <option value="SAINT DENIS, REUNION">
                  SAINT DENIS, REUNION
                </option>

                <option value="SAINT GEORGE, NB, CA.">
                  SAINT GEORGE, NB, CA.
                </option>

                <option value="SAINT GEORGES, BERMUDA">
                  SAINT GEORGES, BERMUDA
                </option>

                <option value="SAINT JOHN, NB, CA.">SAINT JOHN, NB, CA.</option>

                <option value="SAINT JOHNS, NFLD, CA.">
                  SAINT JOHNS, NFLD, CA.
                </option>

                <option value="SAINT LAWRENCE, NFLD, CA">
                  SAINT LAWRENCE, NFLD, CA
                </option>

                <option value="SAINT MARC, HAITI">SAINT MARC, HAITI</option>

                <option value="SAINT NAZAIRE, FRANCE">
                  SAINT NAZAIRE, FRANCE
                </option>

                <option value="SAINT STEPHEN, NB, CA.">
                  SAINT STEPHEN, NB, CA.
                </option>

                <option value="SAIPAN, N MAR I">SAIPAN, N MAR I</option>

                <option value="SAKAI, JAPAN">SAKAI, JAPAN</option>

                <option value="SAKAIDE, JAPAN">SAKAIDE, JAPAN</option>

                <option value="SAKATA, JAPAN">SAKATA, JAPAN</option>

                <option value="SALALAH; MINA RAYSUT, OMAN">
                  SALALAH; MINA RAYSUT, OMAN
                </option>

                <option value="SALAVERRY, PERU">SALAVERRY, PERU</option>

                <option value="SALERNO PORT, ITALY ">
                  SALERNO PORT, ITALY{" "}
                </option>

                <option value="SALERNO, ITALY">SALERNO, ITALY</option>

                <option value="SALINA CRUZ, MEX.">SALINA CRUZ, MEX.</option>

                <option value="SALINAS, ECUADOR">SALINAS, ECUADOR</option>

                <option value="SALTEN,  NORWAY">SALTEN, NORWAY</option>

                <option value="SALVADOR, BRAZIL">SALVADOR, BRAZIL</option>

                <option value="SAMANA,SANTA BARB.DE SAMANA DR">
                  SAMANA,SANTA BARB.DE SAMANA DR
                </option>

                <option value="SAMARINDA, INDONESIA">
                  SAMARINDA, INDONESIA
                </option>

                <option value="SAMIL/YEOSU/YOSU, KOR REP">
                  SAMIL/YEOSU/YOSU, KOR REP
                </option>

                <option value="SAMOS, GREECE">SAMOS, GREECE</option>

                <option value="SAMSUN, TURKEY">SAMSUN, TURKEY</option>

                <option value="SAN ANDRES, COLOMB">SAN ANDRES, COLOMB</option>

                <option value="SAN ANTONIO">SAN ANTONIO</option>

                <option value="SAN ANTONIO, CHILE">SAN ANTONIO, CHILE</option>

                <option value="SAN CIPRIAN, SPAIN">SAN CIPRIAN, SPAIN</option>

                <option value="SAN FELIU DE GUIXOLS, SPAIN">
                  SAN FELIU DE GUIXOLS, SPAIN
                </option>

                <option value="SAN FELIX, VEN.">SAN FELIX, VEN.</option>

                <option value="SAN FERNANDO, PHILIPPINES">
                  SAN FERNANDO, PHILIPPINES
                </option>

                <option value="SAN FERNANDO, TRINIDAD">
                  SAN FERNANDO, TRINIDAD
                </option>

                <option value="SAN JOSE, COSTA RICA">
                  SAN JOSE, COSTA RICA
                </option>

                <option value="SAN JOSE, GUATEMALA">SAN JOSE, GUATEMALA</option>

                <option value="SAN LORENZO, ARG.">SAN LORENZO, ARG.</option>

                <option value="SAN MARCOS,MARTIN,IS,MEX">
                  SAN MARCOS,MARTIN,IS,MEX
                </option>

                <option value="SAN MART, PUERTO DRUMMOND,COL.">
                  SAN MART, PUERTO DRUMMOND,COL.
                </option>

                <option value="SAN NICOLAS BAY, ARUBA ISLAND">
                  SAN NICOLAS BAY, ARUBA ISLAND
                </option>

                <option value="SAN NICOLAS, ARG.">SAN NICOLAS, ARG.</option>

                <option value="SAN NICOLAS, PERU">SAN NICOLAS, PERU</option>

                <option value="SAN PEDRO D MACORIS,D.R.">
                  SAN PEDRO D MACORIS,D.R.
                </option>

                <option value="SAN PEDRO, ARG.">SAN PEDRO, ARG.</option>

                <option value="SAN PEDRO, IVORY COAST">
                  SAN PEDRO, IVORY COAST
                </option>

                <option value="SAN T OU">SAN T OU</option>

                <option value="SAN VICENTE, CHILE">SAN VICENTE, CHILE</option>

                <option value="SANDAKAN, MALAYSA">SANDAKAN, MALAYSA</option>

                <option value="SANDARNE, SWEDEN">SANDARNE, SWEDEN</option>

                <option value="SANDNES,  NORWAY">SANDNES, NORWAY</option>

                <option value="SANTA CRUZ DE LA PALMA">
                  SANTA CRUZ DE LA PALMA
                </option>

                <option value="SANTA CRUZ DE TENERIFE ">
                  SANTA CRUZ DE TENERIFE{" "}
                </option>

                <option value="SANTA CRUZ, PHILIPPINES">
                  SANTA CRUZ, PHILIPPINES
                </option>

                <option value="SANTA FE, ARG.">SANTA FE, ARG.</option>

                <option value="SANTA PANAGIA, ITALY">
                  SANTA PANAGIA, ITALY
                </option>

                <option value="SANTA ROSALIA, MEX.">SANTA ROSALIA, MEX.</option>

                <option value="SANTAN TERMINAL, KALIMANTAN">
                  SANTAN TERMINAL, KALIMANTAN
                </option>

                <option value="SANTANDER, SPAIN">SANTANDER, SPAIN</option>

                <option value="SANTIAGO, CHILE">SANTIAGO, CHILE</option>

                <option value="SANTO DOMINGO, DOM. REP.">
                  SANTO DOMINGO, DOM. REP.
                </option>

                <option value="SANTO TOMAS, GUATEMALA">
                  SANTO TOMAS, GUATEMALA
                </option>

                <option value="SANTO/PALIKULO, VANUATU">
                  SANTO/PALIKULO, VANUATU
                </option>

                <option value="SANTOS">SANTOS</option>

                <option value="SANTOS PORT, BRAZIL">SANTOS PORT, BRAZIL</option>

                <option value="SANTOS, BRASIL">SANTOS, BRASIL</option>

                <option value="SANTOS, BRAZ.">SANTOS, BRAZ.</option>

                <option value="SANTOS, BRAZIL">SANTOS, BRAZIL</option>

                <option value="SANTOS-SP-BRASIL">SANTOS-SP-BRASIL</option>

                <option value="SANTOS-SP/BRASIL">SANTOS-SP/BRASIL</option>

                <option value="SAO FRANCISCO DO SUL, BRAZIL">
                  SAO FRANCISCO DO SUL, BRAZIL
                </option>

                <option value="SAO SEBASTIAO, BRAZ.">
                  SAO SEBASTIAO, BRAZ.
                </option>

                <option value="SAO TOME, SAO TOME AND PRINCIP">
                  SAO TOME, SAO TOME AND PRINCIP
                </option>

                <option value="SAPELE,NIGERIA">SAPELE,NIGERIA</option>

                <option value="SARNIA, ONT, CA.">SARNIA, ONT, CA.</option>

                <option value="SARROCH, ITALY">SARROCH, ITALY</option>

                <option value="SASEBO, JAPAN">SASEBO, JAPAN</option>

                <option value="SAUDA, NORWAY">SAUDA, NORWAY</option>

                <option value="SAULT ST MAR,SOO, ONT,CA">
                  SAULT ST MAR,SOO, ONT,CA
                </option>

                <option value="SAVANNA LA MAR-JAM">SAVANNA LA MAR-JAM</option>

                <option value="SAVONA, ITALY">SAVONA, ITALY</option>

                <option value="SCARBOROUGH, TOBAGO">SCARBOROUGH, TOBAGO</option>

                <option value="SEAFORTH, ENGLAND">SEAFORTH, ENGLAND</option>

                <option value="SECHELT, BC, CA">SECHELT, BC, CA</option>

                <option value="SEIBU, JAPAN">SEIBU, JAPAN</option>

                <option value="SEMARANG, JAVA">SEMARANG, JAVA</option>

                <option value="SEME TERMINAL, BENIN">
                  SEME TERMINAL, BENIN
                </option>

                <option value="SENDAI, JAPAN">SENDAI, JAPAN</option>

                <option value="SENIPAH TERMINAL, KALIMANTAN">
                  SENIPAH TERMINAL, KALIMANTAN
                </option>

                <option value="SEPETIBA">SEPETIBA</option>

                <option value="SERIA, BRUNEI">SERIA, BRUNEI</option>

                <option value="SERIPHOS; SERIFOS, GREECE">
                  SERIPHOS; SERIFOS, GREECE
                </option>

                <option value="SERPENT HARBOR;SPRAGGE,ONT,CA">
                  SERPENT HARBOR;SPRAGGE,ONT,CA
                </option>

                <option value="SETE, FRANCE">SETE, FRANCE</option>

                <option value="SETUBAL, PORTUGAL">SETUBAL, PORTUGAL</option>

                <option value="SEVEN ISLANDS, QUE, CA.">
                  SEVEN ISLANDS, QUE, CA.
                </option>

                <option value="SEVILLE; SEVILLA, SPAIN">
                  SEVILLE; SEVILLA, SPAIN
                </option>

                <option value="SFAX, TUNISIA">SFAX, TUNISIA</option>

                <option value="SHANGHAI">SHANGHAI</option>

                <option value="SHANGHAI PORT">SHANGHAI PORT</option>

                <option value="SHANGHAI SEAPORT CHINA">
                  SHANGHAI SEAPORT CHINA
                </option>

                <option value="SHANGHAI, CHINA">SHANGHAI, CHINA</option>

                <option value="SHARJAH; MINA KHALID, ARAB EM.">
                  SHARJAH; MINA KHALID, ARAB EM.
                </option>

                <option value="SHEERNESS;RIDHAM DOCK, ENGLAND">
                  SHEERNESS;RIDHAM DOCK, ENGLAND
                </option>

                <option value="SHEET HARBOUR, NS">SHEET HARBOUR, NS</option>

                <option value="SHEKOU">SHEKOU</option>

                <option value="SHEKOU, CHINA">SHEKOU, CHINA</option>

                <option value="SHELBURNE, NS">SHELBURNE, NS</option>

                <option value="SHELLHAVEN, ENGLAND">SHELLHAVEN, ENGLAND</option>

                <option value="SHENZHEN">SHENZHEN</option>

                <option value="SHENZHEN, CHINA">SHENZHEN, CHINA</option>

                <option value="SHIMIZU, JAPAN">SHIMIZU, JAPAN</option>

                <option value="SHIMONOSEKI, JAPAN">SHIMONOSEKI, JAPAN</option>

                <option value="SHIMOTSU,  JAPAN">SHIMOTSU, JAPAN</option>

                <option value="SHIOGAMA, JAPAN">SHIOGAMA, JAPAN</option>

                <option value="SHUAIBA; ASH SHUAIBA, KUWAIT">
                  SHUAIBA; ASH SHUAIBA, KUWAIT
                </option>

                <option value="SHUWAIKH, KUWAIT">SHUWAIKH, KUWAIT</option>

                <option value="SIBENIK; SIBVENICO, CROATIA">
                  SIBENIK; SIBVENICO, CROATIA
                </option>

                <option value="SIBUCO BAY, KALIMANTAN">
                  SIBUCO BAY, KALIMANTAN
                </option>

                <option value="SIDI KERIR, EGYPT">SIDI KERIR, EGYPT</option>

                <option value="SIDNEY, BC, CA.">SIDNEY, BC, CA.</option>

                <option value="SIHANOUKVILLE, CAMBODIA">
                  SIHANOUKVILLE, CAMBODIA
                </option>

                <option value="SILLERY, QUE CANADA">SILLERY, QUE CANADA</option>

                <option value="SINES, PORTUGAL">SINES, PORTUGAL</option>

                <option value="SINGAPORE">SINGAPORE</option>

                <option value="SINGAPORE, SINGAPORE">
                  SINGAPORE, SINGAPORE
                </option>

                <option value="SKARAMANGA, GREECE">SKARAMANGA, GREECE</option>

                <option value="SKELLEFTEA, SWEDEN">SKELLEFTEA, SWEDEN</option>

                <option value="SKIEN,  NORWAY">SKIEN, NORWAY</option>

                <option value="SKIKDA, ALGERIA">SKIKDA, ALGERIA</option>

                <option value="SKOLDVIK, PORVOO, FINLAND">
                  SKOLDVIK, PORVOO, FINLAND
                </option>

                <option value="SLUISKIL, NETHERLANDS">
                  SLUISKIL, NETHERLANDS
                </option>

                <option value="SODEGAURA, JAPAN">SODEGAURA, JAPAN</option>

                <option value="SODERHAMN, SWEDEN">SODERHAMN, SWEDEN</option>

                <option value="SOHAR">SOHAR</option>

                <option value="SOHAR , OMAN">SOHAR , OMAN</option>

                <option value="SOHAR, OMAN">SOHAR, OMAN</option>

                <option value="SOKHANA, EGYPT ">SOKHANA, EGYPT </option>

                <option value="SOKHNA, EGYPT ">SOKHNA, EGYPT </option>

                <option value="SOMBRA, ONT, CA.">SOMBRA, ONT, CA.</option>

                <option value="SOMBRERO ISLAND, LEEWARD ISLDS">
                  SOMBRERO ISLAND, LEEWARD ISLDS
                </option>

                <option value="SONGKHLA, THAILAND">SONGKHLA, THAILAND</option>

                <option value="SOOKE, BC">SOOKE, BC</option>

                <option value="SOREL, QUE, CA.">SOREL, QUE, CA.</option>

                <option value="SOUDHA,SOUDA BAY, GREECE">
                  SOUDHA,SOUDA BAY, GREECE
                </option>

                <option value="SOURIS, PEI, CA.">SOURIS, PEI, CA.</option>

                <option value="SOUSSE, TUNISIA ">SOUSSE, TUNISIA </option>

                <option value="SOUTH HARBOR, MANILA, PHILIPPINES">
                  SOUTH HARBOR, MANILA, PHILIPPINES
                </option>

                <option value="SOUTHAMPTON">SOUTHAMPTON</option>

                <option value="SOUTHAMPTON, U.K ">SOUTHAMPTON, U.K </option>

                <option value="SOUTHAMPTON, UNITED KINGDOM">
                  SOUTHAMPTON, UNITED KINGDOM
                </option>

                <option value="SOUTHAMPTON; HAMBLE, ENGLAND">
                  SOUTHAMPTON; HAMBLE, ENGLAND
                </option>

                <option value="SOYO-OIL/QUINFUGUENA TER,ANGOL">
                  SOYO-OIL/QUINFUGUENA TER,ANGOL
                </option>

                <option value="SPALATO; SOLIN, CROATIA">
                  SPALATO; SOLIN, CROATIA
                </option>

                <option value="SPANISH WELLS, BAHAMAS">
                  SPANISH WELLS, BAHAMAS
                </option>

                <option value="SPEIGHTSTOWN, BARBADOS">
                  SPEIGHTSTOWN, BARBADOS
                </option>

                <option value="SPITSBERGEN/SVALBARD,JAN MAYEN">
                  SPITSBERGEN/SVALBARD,JAN MAYEN
                </option>

                <option value="SPLIT, CROATIA">SPLIT, CROATIA</option>

                <option value="SQUAMISH,TWINCRK,HOWIESOUND,BC">
                  SQUAMISH,TWINCRK,HOWIESOUND,BC
                </option>

                <option value="SRIRACHA; SRI RACHA, THAILAND">
                  SRIRACHA; SRI RACHA, THAILAND
                </option>

                <option value="ST. BARTHS/GUSTAVIA, GUADELPE">
                  ST. BARTHS/GUSTAVIA, GUADELPE
                </option>

                <option value="ST. CATHARINES, ONT, CA.">
                  ST. CATHARINES, ONT, CA.
                </option>

                <option value="ST. EUSTATIUS, NETHERLANDS ANT">
                  ST. EUSTATIUS, NETHERLANDS ANT
                </option>

                <option value="ST. GEROGE,  GRENADA">
                  ST. GEROGE, GRENADA
                </option>

                <option value="ST. JOHNS(ST. JEAN),QUE,CA">
                  ST. JOHNS(ST. JEAN),QUE,CA
                </option>

                <option value="ST. JOHNS, ANTIGUA">ST. JOHNS, ANTIGUA</option>

                <option value="ST. PIERRE, MIQUELON">
                  ST. PIERRE, MIQUELON
                </option>

                <option value="ST. ROMUALD, QUE, CA">
                  ST. ROMUALD, QUE, CA
                </option>

                <option value="ST.MAART,ST.MART,GALI,NET.ANTI">
                  ST.MAART,ST.MART,GALI,NET.ANTI
                </option>

                <option value="STANN CREEK,DANGRIGA, BELIZE">
                  STANN CREEK,DANGRIGA, BELIZE
                </option>

                <option value="STANOVAN, BC, CA.">STANOVAN, BC, CA.</option>

                <option value="STAVANGER, NORWAY">STAVANGER, NORWAY</option>

                <option value="STENUNGSUND, SWEDEN">STENUNGSUND, SWEDEN</option>

                <option value="STEPHENVILLE, NFLD.  CA.">
                  STEPHENVILLE, NFLD. CA.
                </option>

                <option value="STETTIN; SZCZECIN, POLAND">
                  STETTIN; SZCZECIN, POLAND
                </option>

                <option value="STEWART, BC, CA.">STEWART, BC, CA.</option>

                <option value="STIGNAESVAERKETS/STIGSNAES,DEN">
                  STIGNAESVAERKETS/STIGSNAES,DEN
                </option>

                <option value="STOCKHOLM, SWEDEN">STOCKHOLM, SWEDEN</option>

                <option value="STOCKVIK,  SWEDEN">STOCKVIK, SWEDEN</option>

                <option value="STRUER, DENMARK">STRUER, DENMARK</option>

                <option value="SU AO/SUAO, CHINA T">SU AO/SUAO, CHINA T</option>

                <option value="SUAPE, BRAZ.">SUAPE, BRAZ.</option>

                <option value="SUBIC BAY FREEPORT ZONE ">
                  SUBIC BAY FREEPORT ZONE{" "}
                </option>

                <option value="SUBIC BAY;OLONGAPO, PHILIPPINE">
                  SUBIC BAY;OLONGAPO, PHILIPPINE
                </option>

                <option value="SUEZ">SUEZ</option>

                <option value="SUEZ; ADABIYA, EGYPT">
                  SUEZ; ADABIYA, EGYPT
                </option>

                <option value="SUKARNAPURA, WEST NEW GUINEA">
                  SUKARNAPURA, WEST NEW GUINEA
                </option>

                <option value="SUKHUMI, GEORGIA">SUKHUMI, GEORGIA</option>

                <option value="SULLOM VOE, SCOTLAND">
                  SULLOM VOE, SCOTLAND
                </option>

                <option value="SULTAN QABOOS; MUSCAT, OMAN">
                  SULTAN QABOOS; MUSCAT, OMAN
                </option>

                <option value="SUMMERSIDE, PEI, CA.">
                  SUMMERSIDE, PEI, CA.
                </option>

                <option value="SUNDERLAND, ENGLAND">SUNDERLAND, ENGLAND</option>

                <option value="SUNDSVALL, SWEDEN">SUNDSVALL, SWEDEN</option>

                <option value="SUNNDALSORA, NORWAY">SUNNDALSORA, NORWAY</option>

                <option value="SUPE, PERU">SUPE, PERU</option>

                <option value="SUR, OMAN">SUR, OMAN</option>

                <option value="SURABAJA, JAVA">SURABAJA, JAVA</option>

                <option value="SURABAYA">SURABAYA</option>

                <option value="SURABAYA, INDONESIA">SURABAYA, INDONESIA</option>

                <option value="SUSAKI, JAPAN">SUSAKI, JAPAN</option>

                <option value="SUVA (SAVU), FIJI ISLS.">
                  SUVA (SAVU), FIJI ISLS.
                </option>

                <option value="SVELGEN,  NORWAY">SVELGEN, NORWAY</option>

                <option value="SVENDBORG, DENMARK">SVENDBORG, DENMARK</option>

                <option value="SWANSEA, WALES">SWANSEA, WALES</option>

                <option value="SWINOUJSCIE, POLAND">SWINOUJSCIE, POLAND</option>

                <option value="SYDNEY">SYDNEY</option>

                <option value="SYDNEY, AUS.">SYDNEY, AUS.</option>

                <option value="SYDNEY, AUSTRALIA">SYDNEY, AUSTRALIA</option>

                <option value="SYDNEY, NS">SYDNEY, NS</option>

                <option value="SYROS, GREECE">SYROS, GREECE</option>

                <option value="SZCZECIN">SZCZECIN</option>

                <option value="SZCZECIN, POLAND">SZCZECIN, POLAND</option>

                <option value="TABACO, PHILIPPINES">TABACO, PHILIPPINES</option>

                <option value="TACLOBAN, PHILIPPINES">
                  TACLOBAN, PHILIPPINES
                </option>

                <option value="TAGONOURA, JAPAN">TAGONOURA, JAPAN</option>

                <option value="TAHITI, FR PAC ISL.">TAHITI, FR PAC ISL.</option>

                <option value="TAHSIS INLET, BC, CA.">
                  TAHSIS INLET, BC, CA.
                </option>

                <option value="TAICHUNG, TAIWAN">TAICHUNG, TAIWAN</option>

                <option value="TAINAN, CHINA (TAIWAN)">
                  TAINAN, CHINA (TAIWAN)
                </option>

                <option value="TAIPEI ">TAIPEI </option>

                <option value="TAIPEI,TAIBEI CHINA TAIWAN">
                  TAIPEI,TAIBEI CHINA TAIWAN
                </option>

                <option value="TAKORADI, GHANA">TAKORADI, GHANA</option>

                <option value="TAKULA TERMINAL, ANGOLA">
                  TAKULA TERMINAL, ANGOLA
                </option>

                <option value="TALARA, PERU">TALARA, PERU</option>

                <option value="TALCAHUANO, CHILE">TALCAHUANO, CHILE</option>

                <option value="TALLINN, ESTONIA">TALLINN, ESTONIA</option>

                <option value="TAMATAVE">TAMATAVE</option>

                <option value="TAMSUI, CHINA (TAIWAN)">
                  TAMSUI, CHINA (TAIWAN)
                </option>

                <option value="TAN CANG, VIETNAM">TAN CANG, VIETNAM</option>

                <option value="TANDOC, PHILIPPINES">TANDOC, PHILIPPINES</option>

                <option value="TANGA, TANZANIA">TANGA, TANZANIA</option>

                <option value="TANGER MED">TANGER MED</option>

                <option value="TANGIER, MOROCCO">TANGIER, MOROCCO</option>

                <option value="TANJIAJING, CHINA M.">
                  TANJIAJING, CHINA M.
                </option>

                <option value="TANJUNG EMAS SEMARANG, INDONESIA">
                  TANJUNG EMAS SEMARANG, INDONESIA
                </option>

                <option value="TANJUNG EMAS SEMARANG,*">
                  TANJUNG EMAS SEMARANG,*
                </option>

                <option value="TANJUNG PELEPAS, MALAYSIA">
                  TANJUNG PELEPAS, MALAYSIA
                </option>

                <option value="TANJUNG PERAK,*">TANJUNG PERAK,*</option>

                <option value="TANJUNG PRIOK PORT,*">
                  TANJUNG PRIOK PORT,*
                </option>

                <option value="TANJUNGPANDAN, BILLITON">
                  TANJUNGPANDAN, BILLITON
                </option>

                <option value="TAORANGA, N ZEAL">TAORANGA, N ZEAL</option>

                <option value="TARAKAN, INDONESIA">TARAKAN, INDONESIA</option>

                <option value="TARANTO, ITALY">TARANTO, ITALY</option>

                <option value="TARBERT;TARBERT ISLAND, IRELAN">
                  TARBERT;TARBERT ISLAND, IRELAN
                </option>

                <option value="TARIFA, SPAIN">TARIFA, SPAIN</option>

                <option value="TARRAGONA, SPAIN">TARRAGONA, SPAIN</option>

                <option value="TAURANGA, NEW ZEALAND">
                  TAURANGA, NEW ZEALAND
                </option>

                <option value="TEESPORT; SEAL SANDS;TEES, ENG">
                  TEESPORT; SEAL SANDS;TEES, ENG
                </option>

                <option value="TEGAL, JAVA">TEGAL, JAVA</option>

                <option value="TEL AVIV YAFO, ISREAL">
                  TEL AVIV YAFO, ISREAL
                </option>

                <option value="TELA, HOND.">TELA, HOND.</option>

                <option value="TEMA (TEMO), GHANA">TEMA (TEMO), GHANA</option>

                <option value="TEMBLADORA, TRINIDAD">
                  TEMBLADORA, TRINIDAD
                </option>

                <option value="TERCEIRA ISLAND, AZORES">
                  TERCEIRA ISLAND, AZORES
                </option>

                <option value="TERNEUZEN, NETHERLANDS">
                  TERNEUZEN, NETHERLANDS
                </option>

                <option value="TEXADA, BC">TEXADA, BC</option>

                <option value="TG PRIOK JAKARTA*">TG PRIOK JAKARTA*</option>

                <option value="TG. PRIOK JAKARTA *">TG. PRIOK JAKARTA *</option>

                <option value="TG. PRIOK, JAKARTA, *">
                  TG. PRIOK, JAKARTA, *
                </option>

                <option value="TG.PRIOK, INDONESIA">TG.PRIOK, INDONESIA</option>

                <option value="THAMES HAVEN, ENGLAND">
                  THAMES HAVEN, ENGLAND
                </option>

                <option value="THAMESPORT, ENGLAND">THAMESPORT, ENGLAND</option>

                <option value="THE HAGUE, NETHERLANDS">
                  THE HAGUE, NETHERLANDS
                </option>

                <option value="THESSALON,THESSAKIN,ONT">
                  THESSALON,THESSAKIN,ONT
                </option>

                <option value="THESSALONIKI">THESSALONIKI</option>

                <option value="THESSALONIKI; SALONIKA, GREECE">
                  THESSALONIKI; SALONIKA, GREECE
                </option>

                <option value="THOROLD, ONT, CA.">THOROLD, ONT, CA.</option>

                <option value="THREE RIVERS, QUE, CA.">
                  THREE RIVERS, QUE, CA.
                </option>

                <option value="THULE, GREENLAND">THULE, GREENLAND</option>

                <option value="THUNDER BAY, ONT, CA">
                  THUNDER BAY, ONT, CA
                </option>

                <option value="TIANJIN">TIANJIN</option>

                <option value="TIENTSIN; TIANJINXIN GANG, CHN">
                  TIENTSIN; TIANJINXIN GANG, CHN
                </option>

                <option value="TILBURY">TILBURY</option>

                <option value="TILBURY, ENGLAND">TILBURY, ENGLAND</option>

                <option value="TIMARU, NEW ZEALAND">TIMARU, NEW ZEALAND</option>

                <option value="TIMOR, TIMOR ISLAND">TIMOR, TIMOR ISLAND</option>

                <option value="TINCAN -PTML ">TINCAN -PTML </option>

                <option value="TINIAN, N MAR I">TINIAN, N MAR I</option>

                <option value="TJIREBON; CHERIBON, JAVA">
                  TJIREBON; CHERIBON, JAVA
                </option>

                <option value="TOAMASINA; TAMATAVE,MADAGASCAR">
                  TOAMASINA; TAMATAVE,MADAGASCAR
                </option>

                <option value="TOBATA, JAPAN">TOBATA, JAPAN</option>

                <option value="TOCOPILLA, CHILE">TOCOPILLA, CHILE</option>

                <option value="TOKELAU ISLANDS">TOKELAU ISLANDS</option>

                <option value="TOKUSHIMA, JAPAN">TOKUSHIMA, JAPAN</option>

                <option value="TOKUYAMA, JAPAN">TOKUYAMA, JAPAN</option>

                <option value="TOKYO">TOKYO</option>

                <option value="TOKYO , JAPAN">TOKYO , JAPAN</option>

                <option value="TOKYO, JAPAN">TOKYO, JAPAN</option>

                <option value="TOMAKOMAI, JAPAN">TOMAKOMAI, JAPAN</option>

                <option value="TOPOLOBAMPO, MEXICO">TOPOLOBAMPO, MEXICO</option>

                <option value="TORONTO">TORONTO</option>

                <option value="TORONTO, CANADA ">TORONTO, CANADA </option>

                <option value="TORONTO, ON CANADA">TORONTO, ON CANADA</option>

                <option value="TORONTO, ONT, CA.">TORONTO, ONT, CA.</option>

                <option value="TOROS GUBRE, TURKEY">TOROS GUBRE, TURKEY</option>

                <option value="TORRECILLA,PUNTA TORRECILLA,DR">
                  TORRECILLA,PUNTA TORRECILLA,DR
                </option>

                <option value="TORREVIEJA, SPAIN">TORREVIEJA, SPAIN</option>

                <option value="TOULON, FRANCE">TOULON, FRANCE</option>

                <option value="TOWNSVILLE, AUS.">TOWNSVILLE, AUS.</option>

                <option value="TOYAMA, JAPAN">TOYAMA, JAPAN</option>

                <option value="TOYOHASHI, JAPAN">TOYOHASHI, JAPAN</option>

                <option value="TRACY, QUE, CA">TRACY, QUE, CA</option>

                <option value="TRAMANDAI, BRAZIL">TRAMANDAI, BRAZIL</option>

                <option value="TRAPANI">TRAPANI</option>

                <option value="TREASURE CAY, BAHAMAS">
                  TREASURE CAY, BAHAMAS
                </option>

                <option value="TRELLEBORG,  SWEDEN">TRELLEBORG, SWEDEN</option>

                <option value="TRIESTE ITALY PORT">TRIESTE ITALY PORT</option>

                <option value="TRIESTE, ITALY">TRIESTE, ITALY</option>

                <option value="TRINCOMALEE,  SRI LKA">
                  TRINCOMALEE, SRI LKA
                </option>

                <option value="TRIPOLI,LEBANON">TRIPOLI,LEBANON</option>

                <option value="TROMBETAS, BRAZIL">TROMBETAS, BRAZIL</option>

                <option value="TROMSO, NORWAY">TROMSO, NORWAY</option>

                <option value="TRONDHEIM, NORWAY">TRONDHEIM, NORWAY</option>

                <option value="TRUK; CHUUK, TURK ISLANDS">
                  TRUK; CHUUK, TURK ISLANDS
                </option>

                <option value="TSINGTAO, QUINGDAO  CHINA M">
                  TSINGTAO, QUINGDAO CHINA M
                </option>

                <option value="TSURUMI, JAPAN">TSURUMI, JAPAN</option>

                <option value="TUBARAO">TUBARAO</option>

                <option value="TUKTOYAKTUK, NWT CANADA">
                  TUKTOYAKTUK, NWT CANADA
                </option>

                <option value="TUMACO, COLOMBIA">TUMACO, COLOMBIA</option>

                <option value="TUNIS, TUNISIA">TUNIS, TUNISIA</option>

                <option value="TURBO, COL.">TURBO, COL.</option>

                <option value="TURKU; ABO, FINLAND">TURKU; ABO, FINLAND</option>

                <option value="TUTICORIN PORT, INDIA">
                  TUTICORIN PORT, INDIA
                </option>

                <option value="TUTICORIN, INDIA">TUTICORIN, INDIA</option>

                <option value="TUXPAN, MEX.">TUXPAN, MEX.</option>

                <option value="UBE, JAPAN">UBE, JAPAN</option>

                <option value="UCUELET, BC, CA">UCUELET, BC, CA</option>

                <option value="UDDEVALLA, SWEDEN">UDDEVALLA, SWEDEN</option>

                <option value="UKPOKITI, NIGERIA">UKPOKITI, NIGERIA</option>

                <option value="ULSAN, KOR REP">ULSAN, KOR REP</option>

                <option value="UMEA, SWEDEN">UMEA, SWEDEN</option>

                <option value="UMM AL QUWAIN, UAE">UMM AL QUWAIN, UAE</option>

                <option value="UNION BAY, BC, CA.">UNION BAY, BC, CA.</option>

                <option value="UNO, JAPAN">UNO, JAPAN</option>

                <option value="UST-DUNAISK, UKRAINE">
                  UST-DUNAISK, UKRAINE
                </option>

                <option value="UTANSJO, SWEDEN">UTANSJO, SWEDEN</option>

                <option value="UUSIKAUPUNKI; NYSTAD, FINLAND">
                  UUSIKAUPUNKI; NYSTAD, FINLAND
                </option>

                <option value="UVOL,MONTAGUHARBOR PAP.NW.GUIN">
                  UVOL,MONTAGUHARBOR PAP.NW.GUIN
                </option>

                <option value="VAASA; VASA, FINLAND">
                  VAASA; VASA, FINLAND
                </option>

                <option value="VADA, ITALY">VADA, ITALY</option>

                <option value="VADO LIGURE, ITALY">VADO LIGURE, ITALY</option>

                <option value="VALENCIA">VALENCIA</option>

                <option value="VALENCIA, SPAIN">VALENCIA, SPAIN</option>

                <option value="VALETTA, MALTA">VALETTA, MALTA</option>

                <option value="VALLVIK, SWEDEN">VALLVIK, SWEDEN</option>

                <option value="VALLYFIELD, QUE, CA">VALLYFIELD, QUE, CA</option>

                <option value="VALPARAISO, CHILE">VALPARAISO, CHILE</option>

                <option value="VAN ANDA, BC, CA.">VAN ANDA, BC, CA.</option>

                <option value="VANCOUVER ">VANCOUVER </option>

                <option value="VANCOUVER, BC">VANCOUVER, BC</option>

                <option value="VANCOUVER, CANADA">VANCOUVER, CANADA</option>

                <option value="VARNA, BULGARIA">VARNA, BULGARIA</option>

                <option value="VASSILIKO, CYPRUS">VASSILIKO, CYPRUS</option>

                <option value="VASTERAS, SWEDEN">VASTERAS, SWEDEN</option>

                <option value="VASTERVIK, SWEDEN">VASTERVIK, SWEDEN</option>

                <option value="VEILE; VEJLE, DENMARK">
                  VEILE; VEJLE, DENMARK
                </option>

                <option value="VENEZIA">VENEZIA</option>

                <option value="VENICE">VENICE</option>

                <option value="VENICE PORT OF ITALY ">
                  VENICE PORT OF ITALY{" "}
                </option>

                <option value="VENICE, ITALY">VENICE, ITALY</option>

                <option value="VENICE; LIDO, ITALY">VENICE; LIDO, ITALY</option>

                <option value="VENTSPILS; VINDAU; VINDAVA, LV">
                  VENTSPILS; VINDAU; VINDAVA, LV
                </option>

                <option value="VERA CRUZ, MEX.">VERA CRUZ, MEX.</option>

                <option value="VERACRUZ">VERACRUZ</option>

                <option value="VERAVAL, INDIA">VERAVAL, INDIA</option>

                <option value="VESTMANNAEYJAR;WEST.ISLES,ICEL">
                  VESTMANNAEYJAR;WEST.ISLES,ICEL
                </option>

                <option value="VICTORIA HARBOR, ONT, CA">
                  VICTORIA HARBOR, ONT, CA
                </option>

                <option value="VICTORIA, PEI">VICTORIA, PEI</option>

                <option value="VICTORIA, SEYCHELLES">
                  VICTORIA, SEYCHELLES
                </option>

                <option value="VICTORIA,GANGES BC CA">
                  VICTORIA,GANGES BC CA
                </option>

                <option value="VICTORIA; VITORIA, BRAZIL">
                  VICTORIA; VITORIA, BRAZIL
                </option>

                <option value="VIEUX FORT, ST. LUCIA">
                  VIEUX FORT, ST. LUCIA
                </option>

                <option value="VIGO, SPAIN">VIGO, SPAIN</option>

                <option value="VILA DO CONDE">VILA DO CONDE</option>

                <option value="VILLA CONSTITUCION, ARG.">
                  VILLA CONSTITUCION, ARG.
                </option>

                <option value="VISAKHAPATNAM PORT, INDIA">
                  VISAKHAPATNAM PORT, INDIA
                </option>

                <option value="VISHAKHAPATNAM, INDIA">
                  VISHAKHAPATNAM, INDIA
                </option>

                <option value="VITORIA PORT IN BRAZIL">
                  VITORIA PORT IN BRAZIL
                </option>

                <option value="VLAARDINGEN, NETHERLANDS">
                  VLAARDINGEN, NETHERLANDS
                </option>

                <option value="VLISSINGEN; FLUSHING, NETHLDS">
                  VLISSINGEN; FLUSHING, NETHLDS
                </option>

                <option value="VOLOS, GREECE">VOLOS, GREECE</option>

                <option value="VUNG TAU">VUNG TAU</option>

                <option value="WAKAMATSU, JAPAN">WAKAMATSU, JAPAN</option>

                <option value="WAKAYAMA, JAPAN">WAKAYAMA, JAPAN</option>

                <option value="WALKER CAY, BAHAMAS">WALKER CAY, BAHAMAS</option>

                <option value="WALKERVILLE, ONT. CA.">
                  WALKERVILLE, ONT. CA.
                </option>

                <option value="WALLHAMN,  SWEDEN">WALLHAMN, SWEDEN</option>

                <option value="WALVIS BAY, NAMIBIA">WALVIS BAY, NAMIBIA</option>

                <option value="WARREN POINT, NORTHERN IRELAND">
                  WARREN POINT, NORTHERN IRELAND
                </option>

                <option value="WARRI, NIGERIA">WARRI, NIGERIA</option>

                <option value="WASHINGTON ISLAND, KIRIBAT">
                  WASHINGTON ISLAND, KIRIBAT
                </option>

                <option value="WATERFORD, IRELAND">WATERFORD, IRELAND</option>

                <option value="WEIPA, AUSTRAL">WEIPA, AUSTRAL</option>

                <option value="WELLAND-DUNNVILLE,ONT,CA">
                  WELLAND-DUNNVILLE,ONT,CA
                </option>

                <option value="WELLINGTON, NEW ZEALAND">
                  WELLINGTON, NEW ZEALAND
                </option>

                <option value="WELSHPOOL, NB">WELSHPOOL, NB</option>

                <option value="WENZHOW CHINA">WENZHOW CHINA</option>

                <option value="WEST END, BAHAMAS">WEST END, BAHAMAS</option>

                <option value="WESTERNPORT, AUS">WESTERNPORT, AUS</option>

                <option value="WEWAK, PAPUA NEW GUINEA">
                  WEWAK, PAPUA NEW GUINEA
                </option>

                <option value="WHIFFEN HEAD, NF, CANADA">
                  WHIFFEN HEAD, NF, CANADA
                </option>

                <option value="WHITBY, PORT WHITBY ONT">
                  WHITBY, PORT WHITBY ONT
                </option>

                <option value="WHITEFISH RIVER, ONT.  CA.">
                  WHITEFISH RIVER, ONT. CA.
                </option>

                <option value="WHONOCK, WHONNOCK, BC CANADA">
                  WHONOCK, WHONNOCK, BC CANADA
                </option>

                <option value="WILHELMSHAVEN, FR GERMANY">
                  WILHELMSHAVEN, FR GERMANY
                </option>

                <option value="WINDSOR, ONT, CA.">WINDSOR, ONT, CA.</option>

                <option value="WISMAR, FR GERMANY">WISMAR, FR GERMANY</option>

                <option value="WOODBRIDGE BAY, DOMINICA ISLD">
                  WOODBRIDGE BAY, DOMINICA ISLD
                </option>

                <option value="WOODFIBRE, BC">WOODFIBRE, BC</option>

                <option value="XIAMEN">XIAMEN</option>

                <option value="XIAMEN,CHINA">XIAMEN,CHINA</option>

                <option value="XIAMEN;HSIA MEN,AMOY, CHINA">
                  XIAMEN;HSIA MEN,AMOY, CHINA
                </option>

                <option value="XINGANG">XINGANG</option>

                <option value="XINGANG TIANJIN, CHINA">
                  XINGANG TIANJIN, CHINA
                </option>

                <option value="XINGANG, CHINA">XINGANG, CHINA</option>

                <option value="XINHUI, CHINA">XINHUI, CHINA</option>

                <option value="YALOVA, TURKEY">YALOVA, TURKEY</option>

                <option value="YANGSHAN, CHINA">YANGSHAN, CHINA</option>

                <option value="YANTIAN">YANTIAN</option>

                <option value="YANTIAN, CHINA">YANTIAN, CHINA</option>

                <option value="YANTIAN, CHINA M">YANTIAN, CHINA M</option>

                <option value="YAP, MICRONESIA">YAP, MICRONESIA</option>

                <option value="YARIMCA, IZMIT, TURKEY">
                  YARIMCA, IZMIT, TURKEY
                </option>

                <option value="YARMOUTH, NS">YARMOUTH, NS</option>

                <option value="YATSUSHIRO, JAPAN">YATSUSHIRO, JAPAN</option>

                <option value="YAWATA, JAPAN">YAWATA, JAPAN</option>

                <option value="YICHANG">YICHANG</option>

                <option value="YILPORT">YILPORT</option>

                <option value="YINGKOU, CHINA">YINGKOU, CHINA</option>

                <option value="YOKKAICHI, JAPAN">YOKKAICHI, JAPAN</option>

                <option value="YOKOHAMA, JAPAN">YOKOHAMA, JAPAN</option>

                <option value="YOKOSUKA, JAPAN">YOKOSUKA, JAPAN</option>

                <option value="YXPILA; YKSPIHLAJA, FINLAND">
                  YXPILA; YKSPIHLAJA, FINLAND
                </option>

                <option value="ZADAR, CROATIA">ZADAR, CROATIA</option>

                <option value="ZAFIRA, EQUATORIAL GUINEA">
                  ZAFIRA, EQUATORIAL GUINEA
                </option>

                <option value="ZAMBOANGA, PHILIPPINES">
                  ZAMBOANGA, PHILIPPINES
                </option>

                <option value="ZANTE; ZAKINTHOS, GREECE">
                  ZANTE; ZAKINTHOS, GREECE
                </option>

                <option value="ZANZIBAR, TANZANIA">ZANZIBAR, TANZANIA</option>

                <option value="ZARATE, ARGENTINA">ZARATE, ARGENTINA</option>

                <option value="ZEEBRUGGE, BELGIUM">ZEEBRUGGE, BELGIUM</option>

                <option value="ZHANGJIAGANG; ZHENJIANG, CHINA">
                  ZHANGJIAGANG; ZHENJIANG, CHINA
                </option>

                <option value="ZHONGSHAN, CHINA M">ZHONGSHAN, CHINA M</option>

                <option value="ZHUHAI ">ZHUHAI </option>
              </Form.Select>
              <Form.Text className="error">
                {errors.portOfLoading ? errors?.portOfLoading.message : ""}
              </Form.Text>
            </div>
            <div className="thirddiv">
              <FormInput
                formProps={{
                  control,
                  name: "loadingPier",
                  label: "LOADING PIER/TERMINAL",
                }}
              />
              {/* <label htmlFor="loadingPier" className="loadPierTermingal">
                LOADING PIER/TERMINAL
              </label>
              <input
                {...register("loadingPier")}
                name="loadingPier"
                className="field_b"
                type="text"
              /> */}
            </div>
          </div>
          <div className="second-container-third-item">
            <div className="firstdiv">
              <Form.Label htmlFor="portOfDischarge">
                PORT OF DISCHARGE <span className="red">*</span>
              </Form.Label>
              <Form.Select
                aria-label="Default select example"
                {...register("portOfDischarge")}
                id="portOfDischarge"
                name="portOfDischarge"
                className="fields_r portOfDischargeselect rselect"
              >
                <option value=""></option>
                <option value="HAZIRA PORT IN INDIA">
                  HAZIRA PORT IN INDIA
                </option>

                <option value="ISTANBUL KUMPORT,TURKEY ">
                  ISTANBUL KUMPORT,TURKEY
                </option>

                <option value=" IZMIT EVYAP PORT-TURKEY">
                  IZMIT EVYAP PORT-TURKEY
                </option>

                <option value=" MAPUTO PORT, MOZAMBIQUE">
                  MAPUTO PORT, MOZAMBIQUE
                </option>

                <option value="AABENRAA,  DENMARK">AABENRAA, DENMARK</option>

                <option value="AALBORG, DENMARK">AALBORG, DENMARK</option>

                <option value="AALESUND,  NORWAY">AALESUND, NORWAY</option>

                <option value="AARDAL;AARDALSTANGEN,NORWAY">
                  AARDAL;AARDALSTANGEN,NORWAY
                </option>

                <option value="AARHUS, DENMARK">AARHUS, DENMARK</option>

                <option value="ABERDEEN, SCOTLAND">ABERDEEN, SCOTLAND</option>

                <option value="ABIDJAN, IVORY COAST">
                  ABIDJAN, IVORY COAST
                </option>

                <option value="ABU DHABI, U.A.E.">ABU DHABI, U.A.E.</option>

                <option value="ABU QIR/ABUKIR/ABU KIR B,EGYPT">
                  ABU QIR/ABUKIR/ABU KIR B,EGYPT
                </option>

                <option value="ABU ZABY, ARAB EM.">ABU ZABY, ARAB EM.</option>

                <option value="ACAJUTLA, EL SALV.">ACAJUTLA, EL SALV.</option>

                <option value="ACAPULCO, MEX.">ACAPULCO, MEX.</option>

                <option value="ACCRA, GHANA">ACCRA, GHANA</option>

                <option value="AD DAMMAM, SAUDI ARABIA">
                  AD DAMMAM, SAUDI ARABIA
                </option>

                <option value="AD DAMMAN; DAMMAN, SAUDI ARAB.">
                  AD DAMMAN; DAMMAN, SAUDI ARAB.
                </option>

                <option value="ADELAIDE, AUSTRALIA">ADELAIDE, AUSTRALIA</option>

                <option value="ADEN, YEMEN">ADEN, YEMEN</option>

                <option value="AGADIR, MOROCCO">AGADIR, MOROCCO</option>

                <option value="AGUADULCE, COSTA RICA">
                  AGUADULCE, COSTA RICA
                </option>

                <option value="AGUADULCE, PANAMA">AGUADULCE, PANAMA</option>

                <option value="AHMEDABAD ICD , INDIA">
                  AHMEDABAD ICD , INDIA
                </option>

                <option value="AHUS, SWEDEN">AHUS, SWEDEN</option>

                <option value="AIN SUKHNA, EGYPT">AIN SUKHNA, EGYPT</option>

                <option value="AJMAN, UAE">AJMAN, UAE</option>

                <option value="AKRANES, ICELAND">AKRANES, ICELAND</option>

                <option value="AKUREYRI, ICELAND">AKUREYRI, ICELAND</option>

                <option value="AL JUBAIL; JUBAIL, SAUDI ARAB.">
                  AL JUBAIL; JUBAIL, SAUDI ARAB.
                </option>

                <option value="AL KHUBAR, SAUDI ARABIA">
                  AL KHUBAR, SAUDI ARABIA
                </option>

                <option value="AL SOKHNA">AL SOKHNA</option>

                <option value="ALCANAR, SPAIN">ALCANAR, SPAIN</option>

                <option value="ALEXANDRIA SEAPORT, EGYPT ">
                  ALEXANDRIA SEAPORT, EGYPT{" "}
                </option>

                <option value="ALEXANDRIA, EGYPT">ALEXANDRIA, EGYPT</option>

                <option value="ALGECIRAS, SPAIN">ALGECIRAS, SPAIN</option>

                <option value="ALGIERS, ALGERIA">ALGIERS, ALGERIA</option>
                <option value="ALIAGA IZMIR PORT,TURKEY">
                  ALIAGA IZMIR PORT,TURKEY
                </option>
                <option value="ALIAGA PORT, TURKEY">ALIAGA PORT, TURKEY</option>
                <option value="ALIAGA, IZMIR, TURKIYE">
                  ALIAGA, IZMIR, TURKIYE
                </option>
                <option value="ALICANTE, SPAIN">ALICANTE, SPAIN</option>
                <option value="ALIVER, GREECE">ALIVER, GREECE</option>
                <option value="ALL CAROLINE IS PORT, KIRIBAT">
                  ALL CAROLINE IS PORT, KIRIBAT
                </option>
                <option value="ALL COLOMBIA AMAZON PORTS">
                  ALL COLOMBIA AMAZON PORTS
                </option>
                <option value="ALL COMOROS PORTS">ALL COMOROS PORTS</option>
                <option value="ALL CORSICA PORTS">ALL CORSICA PORTS</option>
                <option value="ALL FALKLAND ISLANDS PORTS">
                  ALL FALKLAND ISLANDS PORTS
                </option>
                <option value="ALL FAROE ISLAND PORTS">
                  ALL FAROE ISLAND PORTS
                </option>
                <option value="ALL FRENCH GUIANA PORTS">
                  ALL FRENCH GUIANA PORTS
                </option>
                <option value="ALL FRENCH SO &amp; ANTARCTIC LAND">
                  ALL FRENCH SO &amp; ANTARCTIC LAND
                </option>

                <option value="ALL GILBERT IS PORTS, KIRIBAT">
                  ALL GILBERT IS PORTS, KIRIBAT
                </option>

                <option value="ALL GUINEA-BISSAU PORTS">
                  ALL GUINEA-BISSAU PORTS
                </option>

                <option value="ALL MOLUCCAS PORTS">ALL MOLUCCAS PORTS</option>

                <option value="ALL OTH ARGENTINA PORTS">
                  ALL OTH ARGENTINA PORTS
                </option>

                <option value="ALL OTH BELGIUM PORTS">
                  ALL OTH BELGIUM PORTS
                </option>

                <option value="ALL OTH BRIT INDN OCEAN TER PT">
                  ALL OTH BRIT INDN OCEAN TER PT
                </option>

                <option value="ALL OTH CAICOS ISLANDS PORTS">
                  ALL OTH CAICOS ISLANDS PORTS
                </option>

                <option value="ALL OTH CANARY ISLANDS PORTS">
                  ALL OTH CANARY ISLANDS PORTS
                </option>

                <option value="ALL OTH CAYMAN ISLAND PORTS">
                  ALL OTH CAYMAN ISLAND PORTS
                </option>

                <option value="ALL OTH COASTA RICA CARIB PTS">
                  ALL OTH COASTA RICA CARIB PTS
                </option>

                <option value="ALL OTH COLOMBIA W COAST PORTS">
                  ALL OTH COLOMBIA W COAST PORTS
                </option>

                <option value="ALL OTH COLOMBIAN CARIB PORTS">
                  ALL OTH COLOMBIAN CARIB PORTS
                </option>

                <option value="ALL OTH COSTA RICA W COAST PTS">
                  ALL OTH COSTA RICA W COAST PTS
                </option>

                <option value="ALL OTH DOMINICAN REP. PORTS">
                  ALL OTH DOMINICAN REP. PORTS
                </option>

                <option value="ALL OTH EGYPT MEDITERRANEAN PT">
                  ALL OTH EGYPT MEDITERRANEAN PT
                </option>

                <option value="ALL OTH EGYPT RED SEA REG PORT">
                  ALL OTH EGYPT RED SEA REG PORT
                </option>

                <option value="ALL OTH EL SALVADOR PORTS">
                  ALL OTH EL SALVADOR PORTS
                </option>

                <option value="ALL OTH ENGLAND S &amp; E COAST PT">
                  ALL OTH ENGLAND S &amp; E COAST PT
                </option>

                <option value="ALL OTH ENGLAND WEST COAST PTS">
                  ALL OTH ENGLAND WEST COAST PTS
                </option>

                <option value="ALL OTH FRANCE ATLANTIC PORTS">
                  ALL OTH FRANCE ATLANTIC PORTS
                </option>

                <option value="ALL OTH FRANCE MEDITRAN. PORTS">
                  ALL OTH FRANCE MEDITRAN. PORTS
                </option>

                <option value="ALL OTH GEORGIA PORTS">
                  ALL OTH GEORGIA PORTS
                </option>

                <option value="ALL OTH GUADELOUPE PORTS">
                  ALL OTH GUADELOUPE PORTS
                </option>

                <option value="ALL OTH GUATEMALA CARIB PORTS">
                  ALL OTH GUATEMALA CARIB PORTS
                </option>

                <option value="ALL OTH GUATEMALA W.COAST PTS">
                  ALL OTH GUATEMALA W.COAST PTS
                </option>

                <option value="ALL OTH GUYANA PORTS">
                  ALL OTH GUYANA PORTS
                </option>

                <option value="ALL OTH HAITI PORTS">ALL OTH HAITI PORTS</option>

                <option value="ALL OTH HONDURAS CARIB PORTS">
                  ALL OTH HONDURAS CARIB PORTS
                </option>

                <option value="ALL OTH ICELAND PORTS">
                  ALL OTH ICELAND PORTS
                </option>

                <option value="ALL OTH INDIA EAST COAST PORTS">
                  ALL OTH INDIA EAST COAST PORTS
                </option>

                <option value="ALL OTH IRELAND PORTS">
                  ALL OTH IRELAND PORTS
                </option>

                <option value="ALL OTH ISRAEL MEDITERR. PORTS">
                  ALL OTH ISRAEL MEDITERR. PORTS
                </option>

                <option value="ALL OTH JAMAICA PORTS">
                  ALL OTH JAMAICA PORTS
                </option>

                <option value="ALL OTH LEEWARD ISLAND PORTS">
                  ALL OTH LEEWARD ISLAND PORTS
                </option>

                <option value="ALL OTH MARTINIQUE PORTS">
                  ALL OTH MARTINIQUE PORTS
                </option>

                <option value="ALL OTH MEXICO EAST COAST PTS">
                  ALL OTH MEXICO EAST COAST PTS
                </option>

                <option value="ALL OTH MOROCCO ATLANTIC REG.">
                  ALL OTH MOROCCO ATLANTIC REG.
                </option>

                <option value="ALL OTH MOROCCO MEDITRN PORTS">
                  ALL OTH MOROCCO MEDITRN PORTS
                </option>

                <option value="ALL OTH NETHERLAND ANTILLES PT">
                  ALL OTH NETHERLAND ANTILLES PT
                </option>

                <option value="ALL OTH NETHERLANDS PORTS">
                  ALL OTH NETHERLANDS PORTS
                </option>

                <option value="ALL OTH NICARAGUAN CARIB PORTS">
                  ALL OTH NICARAGUAN CARIB PORTS
                </option>

                <option value="ALL OTH NICARAGUAN W COAST PTS">
                  ALL OTH NICARAGUAN W COAST PTS
                </option>

                <option value="ALL OTH NORTHERN IRELAND PORTS">
                  ALL OTH NORTHERN IRELAND PORTS
                </option>

                <option value="ALL OTH PACIFIC ISLANDS N.E.C.">
                  ALL OTH PACIFIC ISLANDS N.E.C.
                </option>

                <option value="ALL OTH PANAMA CARIB PORTS">
                  ALL OTH PANAMA CARIB PORTS
                </option>

                <option value="ALL OTH PANAMA W COAST PORTS">
                  ALL OTH PANAMA W COAST PORTS
                </option>

                <option value="ALL OTH PARAGUAY PORTS">
                  ALL OTH PARAGUAY PORTS
                </option>

                <option value="ALL OTH PEOPLES REP. CHINA PTS">
                  ALL OTH PEOPLES REP. CHINA PTS
                </option>

                <option value="ALL OTH PORTUGAL PORTS">
                  ALL OTH PORTUGAL PORTS
                </option>

                <option value="ALL OTH SAO TOME &amp; PRINCIPE PT">
                  ALL OTH SAO TOME &amp; PRINCIPE PT
                </option>

                <option value="ALL OTH SAUDI ARABIA PORTS">
                  ALL OTH SAUDI ARABIA PORTS
                </option>

                <option value="ALL OTH SCOTLAND E COAST PORTS">
                  ALL OTH SCOTLAND E COAST PORTS
                </option>

                <option value="ALL OTH SCOTLAND W COAST PORTS">
                  ALL OTH SCOTLAND W COAST PORTS
                </option>

                <option value="ALL OTH SOCIETY ISLANDS PORTS">
                  ALL OTH SOCIETY ISLANDS PORTS
                </option>

                <option value="ALL OTH SOMALIA EASTERN REG PT">
                  ALL OTH SOMALIA EASTERN REG PT
                </option>

                <option value="ALL OTH SOUTHERN ASIA NEC PORT">
                  ALL OTH SOUTHERN ASIA NEC PORT
                </option>

                <option value="ALL OTH SOUTHERN PACIFIC ISL P">
                  ALL OTH SOUTHERN PACIFIC ISL P
                </option>

                <option value="ALL OTH SP ATL PT N OF PORTUGA">
                  ALL OTH SP ATL PT N OF PORTUGA
                </option>

                <option value="ALL OTH SP ATL PT SE OF PRTUGL">
                  ALL OTH SP ATL PT SE OF PRTUGL
                </option>

                <option value="ALL OTH SPAIN MEDTERAN. PORTS">
                  ALL OTH SPAIN MEDTERAN. PORTS
                </option>

                <option value="ALL OTH SPANISH AFRICA, N.E.C.">
                  ALL OTH SPANISH AFRICA, N.E.C.
                </option>

                <option value="ALL OTH SURINAME PORTS">
                  ALL OTH SURINAME PORTS
                </option>

                <option value="ALL OTH SWDN PRTS;HARARE SWDN">
                  ALL OTH SWDN PRTS;HARARE SWDN
                </option>

                <option value="ALL OTH TRINIDAD PORTS">
                  ALL OTH TRINIDAD PORTS
                </option>

                <option value="ALL OTH TURKEY BLK/MARMARA PT">
                  ALL OTH TURKEY BLK/MARMARA PT
                </option>

                <option value="ALL OTH TURKEY MEDITERRAN PTS.">
                  ALL OTH TURKEY MEDITERRAN PTS.
                </option>

                <option value="ALL OTH TURKS ISLANDS PORTS">
                  ALL OTH TURKS ISLANDS PORTS
                </option>

                <option value="ALL OTH UKRAINE PORTS">
                  ALL OTH UKRAINE PORTS
                </option>

                <option value="ALL OTH UNITED ARAB EMIRATE PT">
                  ALL OTH UNITED ARAB EMIRATE PT
                </option>

                <option value="ALL OTH VENEZUELA PORTS">
                  ALL OTH VENEZUELA PORTS
                </option>

                <option value="ALL OTH WINDWARD ISLAND PORTS">
                  ALL OTH WINDWARD ISLAND PORTS
                </option>

                <option value="ALL OTH YUGOSLAVIA PORTS">
                  ALL OTH YUGOSLAVIA PORTS
                </option>

                <option value="ALL OTHER ALBANIA PORTS">
                  ALL OTHER ALBANIA PORTS
                </option>

                <option value="ALL OTHER ALGERIA PORTS">
                  ALL OTHER ALGERIA PORTS
                </option>

                <option value="ALL OTHER ANGOLA PORTS">
                  ALL OTHER ANGOLA PORTS
                </option>

                <option value="ALL OTHER AUSTRALIA PORTS">
                  ALL OTHER AUSTRALIA PORTS
                </option>

                <option value="ALL OTHER AZORES PORTS">
                  ALL OTHER AZORES PORTS
                </option>

                <option value="ALL OTHER BAHRAIN PORTS">
                  ALL OTHER BAHRAIN PORTS
                </option>

                <option value="ALL OTHER BANGLADESH PORTS">
                  ALL OTHER BANGLADESH PORTS
                </option>

                <option value="ALL OTHER BENIN PORTS">
                  ALL OTHER BENIN PORTS
                </option>

                <option value="ALL OTHER BERMUDA PORTS">
                  ALL OTHER BERMUDA PORTS
                </option>

                <option value="ALL OTHER BRAZIL PORTS NORTH OF RECIFE">
                  ALL OTHER BRAZIL PORTS NORTH OF RECIFE
                </option>

                <option value="ALL OTHER BRAZIL PORTS SOUTH OF RECIFE">
                  ALL OTHER BRAZIL PORTS SOUTH OF RECIFE
                </option>

                <option value="ALL OTHER BRUNEI PORTS">
                  ALL OTHER BRUNEI PORTS
                </option>

                <option value="ALL OTHER BULGARIA PORTS">
                  ALL OTHER BULGARIA PORTS
                </option>

                <option value="ALL OTHER CAMEROON PORTS">
                  ALL OTHER CAMEROON PORTS
                </option>

                <option value="ALL OTHER CAPE VERDE PORTS">
                  ALL OTHER CAPE VERDE PORTS
                </option>

                <option value="ALL OTHER CHILE PORTS">
                  ALL OTHER CHILE PORTS
                </option>

                <option value="ALL OTHER CHINA (TAIWAN) PORTS">
                  ALL OTHER CHINA (TAIWAN) PORTS
                </option>

                <option value="ALL OTHER CROATIA PORTS">
                  ALL OTHER CROATIA PORTS
                </option>

                <option value="ALL OTHER CYPRUS PORTS">
                  ALL OTHER CYPRUS PORTS
                </option>

                <option value="ALL OTHER DENMARK PORTS">
                  ALL OTHER DENMARK PORTS
                </option>

                <option value="ALL OTHER ECUADOR PORTS">
                  ALL OTHER ECUADOR PORTS
                </option>

                <option value="ALL OTHER EQUATORIAL GUINEA PT">
                  ALL OTHER EQUATORIAL GUINEA PT
                </option>

                <option value="ALL OTHER ERITREA PORTS">
                  ALL OTHER ERITREA PORTS
                </option>

                <option value="ALL OTHER ESTONIA PORTS">
                  ALL OTHER ESTONIA PORTS
                </option>

                <option value="ALL OTHER FIJI ISLANDS PORTS">
                  ALL OTHER FIJI ISLANDS PORTS
                </option>

                <option value="ALL OTHER FINLAND PORTS">
                  ALL OTHER FINLAND PORTS
                </option>

                <option value="ALL OTHER GABON PORTS">
                  ALL OTHER GABON PORTS
                </option>

                <option value="ALL OTHER GAMBIA PORTS">
                  ALL OTHER GAMBIA PORTS
                </option>

                <option value="ALL OTHER GHANA PORTS">
                  ALL OTHER GHANA PORTS
                </option>

                <option value="ALL OTHER GREECE PORTS">
                  ALL OTHER GREECE PORTS
                </option>

                <option value="ALL OTHER GREENLD. PORTS">
                  ALL OTHER GREENLD. PORTS
                </option>

                <option value="ALL OTHER GUINEA PORTS">
                  ALL OTHER GUINEA PORTS
                </option>

                <option value="ALL OTHER INDIA WEST COAST PTS">
                  ALL OTHER INDIA WEST COAST PTS
                </option>

                <option value="ALL OTHER INDONESIA PORTS">
                  ALL OTHER INDONESIA PORTS
                </option>

                <option value="ALL OTHER IVORY COAST PORTS">
                  ALL OTHER IVORY COAST PORTS
                </option>

                <option value="ALL OTHER JAVA PORTS">
                  ALL OTHER JAVA PORTS
                </option>

                <option value="ALL OTHER JORDAN PORTS">
                  ALL OTHER JORDAN PORTS
                </option>

                <option value="ALL OTHER KALIMANTAN PORTS">
                  ALL OTHER KALIMANTAN PORTS
                </option>

                <option value="ALL OTHER KENYA PORTS">
                  ALL OTHER KENYA PORTS
                </option>

                <option value="ALL OTHER KUWAIT PORTS">
                  ALL OTHER KUWAIT PORTS
                </option>

                <option value="ALL OTHER LATVIA PORTS">
                  ALL OTHER LATVIA PORTS
                </option>

                <option value="ALL OTHER LEBANON PORTS">
                  ALL OTHER LEBANON PORTS
                </option>

                <option value="ALL OTHER LITHUANIA PORTS">
                  ALL OTHER LITHUANIA PORTS
                </option>

                <option value="ALL OTHER MADAGASCAR PORTS">
                  ALL OTHER MADAGASCAR PORTS
                </option>

                <option value="ALL OTHER MALAYSIA PORTS">
                  ALL OTHER MALAYSIA PORTS
                </option>

                <option value="ALL OTHER MALTA PORTS">
                  ALL OTHER MALTA PORTS
                </option>

                <option value="ALL OTHER MAURITANIA PORTS">
                  ALL OTHER MAURITANIA PORTS
                </option>

                <option value="ALL OTHER MAURITIUS PORTS">
                  ALL OTHER MAURITIUS PORTS
                </option>

                <option value="ALL OTHER MOZAMBIQUE PORTS">
                  ALL OTHER MOZAMBIQUE PORTS
                </option>

                <option value="ALL OTHER MX W.CST REGN PT">
                  ALL OTHER MX W.CST REGN PT
                </option>

                <option value="ALL OTHER NAMIBIA PORTS">
                  ALL OTHER NAMIBIA PORTS
                </option>

                <option value="ALL OTHER NEW CALEDONIA PORTS">
                  ALL OTHER NEW CALEDONIA PORTS
                </option>

                <option value="ALL OTHER NEW ZEALAND PORTS">
                  ALL OTHER NEW ZEALAND PORTS
                </option>

                <option value="ALL OTHER NIGERIA PORTS">
                  ALL OTHER NIGERIA PORTS
                </option>

                <option value="ALL OTHER NORWAY PORTS">
                  ALL OTHER NORWAY PORTS
                </option>

                <option value="ALL OTHER OMAN PORTS">
                  ALL OTHER OMAN PORTS
                </option>

                <option value="ALL OTHER PAKISTAN PORTS">
                  ALL OTHER PAKISTAN PORTS
                </option>

                <option value="ALL OTHER PAPUA NEW GUINEA PTS">
                  ALL OTHER PAPUA NEW GUINEA PTS
                </option>

                <option value="ALL OTHER PERU PORTS">
                  ALL OTHER PERU PORTS
                </option>

                <option value="ALL OTHER PHILIPPINES PORTS">
                  ALL OTHER PHILIPPINES PORTS
                </option>

                <option value="ALL OTHER POLAND PORTS">
                  ALL OTHER POLAND PORTS
                </option>

                <option value="ALL OTHER QATAR PORTS">
                  ALL OTHER QATAR PORTS
                </option>

                <option value="ALL OTHER ROMANIA PORTS">
                  ALL OTHER ROMANIA PORTS
                </option>

                <option value="ALL OTHER SARDINIA PORTS">
                  ALL OTHER SARDINIA PORTS
                </option>

                <option value="ALL OTHER SENEGAL PORTS">
                  ALL OTHER SENEGAL PORTS
                </option>

                <option value="ALL OTHER SEYCHELLES PORTS">
                  ALL OTHER SEYCHELLES PORTS
                </option>

                <option value="ALL OTHER SICILY PORTS">
                  ALL OTHER SICILY PORTS
                </option>

                <option value="ALL OTHER SIERRA LEONE PORTS">
                  ALL OTHER SIERRA LEONE PORTS
                </option>

                <option value="ALL OTHER SINGAPORE PORTS">
                  ALL OTHER SINGAPORE PORTS
                </option>

                <option value="ALL OTHER SLOVENIA PORTS">
                  ALL OTHER SLOVENIA PORTS
                </option>

                <option value="ALL OTHER SOUTH KOREA PORTS">
                  ALL OTHER SOUTH KOREA PORTS
                </option>

                <option value="ALL OTHER SRI LANKA PORTS">
                  ALL OTHER SRI LANKA PORTS
                </option>

                <option value="ALL OTHER SULAWESI PORTS">
                  ALL OTHER SULAWESI PORTS
                </option>

                <option value="ALL OTHER SUMATRA PORTS">
                  ALL OTHER SUMATRA PORTS
                </option>

                <option value="ALL OTHER TANZANIA PORTS">
                  ALL OTHER TANZANIA PORTS
                </option>

                <option value="ALL OTHER TASMANIA PORTS">
                  ALL OTHER TASMANIA PORTS
                </option>

                <option value="ALL OTHER TOGO PORTS">
                  ALL OTHER TOGO PORTS
                </option>

                <option value="ALL OTHER TUNISIA PORTS">
                  ALL OTHER TUNISIA PORTS
                </option>

                <option value="ALL OTHER URUGUAY PORTS">
                  ALL OTHER URUGUAY PORTS
                </option>

                <option value="ALL OTHER VIETNAM PORTS">
                  ALL OTHER VIETNAM PORTS
                </option>

                <option value="ALL OTHER VIRGIN ISLANDS PORTS">
                  ALL OTHER VIRGIN ISLANDS PORTS
                </option>

                <option value="ALL OTHER WALES PORTS">
                  ALL OTHER WALES PORTS
                </option>

                <option value="ALL OTHER WEST NEW GUINEA PORT">
                  ALL OTHER WEST NEW GUINEA PORT
                </option>

                <option value="ALL OTHER WESTERN SAHARA PORTS">
                  ALL OTHER WESTERN SAHARA PORTS
                </option>

                <option value="ALL OTHER YEMEN PORTS">
                  ALL OTHER YEMEN PORTS
                </option>

                <option value="ALL PORTS IN CAMBODIA">
                  ALL PORTS IN CAMBODIA
                </option>

                <option value="ALL SOLOMON ISLANDS PORTS">
                  ALL SOLOMON ISLANDS PORTS
                </option>

                <option value="ALL SOMALIA NORTHER REG. PORTS">
                  ALL SOMALIA NORTHER REG. PORTS
                </option>

                <option value="ALL ST. HELENA PORTS">
                  ALL ST. HELENA PORTS
                </option>

                <option value="ALL TONGA ISLANDS PORTS">
                  ALL TONGA ISLANDS PORTS
                </option>

                <option value="ALL WALLIS AND FUTUNA PORTS">
                  ALL WALLIS AND FUTUNA PORTS
                </option>

                <option value="ALLEPPEY, INDIA">ALLEPPEY, INDIA</option>

                <option value="ALLOTHER ST.CROIX,ST.CROIX VI">
                  ALLOTHER ST.CROIX,ST.CROIX VI
                </option>

                <option value="ALLOTHERPORTS,SATTAHIPTHAILAND">
                  ALLOTHERPORTS,SATTAHIPTHAILAND
                </option>

                <option value="ALLUTH KALIMANTAN/KATAWARINGIN">
                  ALLUTH KALIMANTAN/KATAWARINGIN
                </option>

                <option value="ALMERIA, SPAIN">ALMERIA, SPAIN</option>

                <option value="ALMIRANTE, PAN.">ALMIRANTE, PAN.</option>

                <option value="ALOTAU, PAPUA NEW GUINEA">
                  ALOTAU, PAPUA NEW GUINEA
                </option>

                <option value="ALPHEN AAN DEN RIJN, NETHLDS">
                  ALPHEN AAN DEN RIJN, NETHLDS
                </option>

                <option value="ALTAMIRA">ALTAMIRA</option>

                <option value="ALTAMIRA, MEXICO">ALTAMIRA, MEXICO</option>

                <option value="ALTAMIRA, TAMPICO, PUERTO MADERO, MEX.">
                  ALTAMIRA, TAMPICO, PUERTO MADERO, MEX.
                </option>

                <option value="ALVARO OBR-FRONTERA,MEX.">
                  ALVARO OBR-FRONTERA,MEX.
                </option>

                <option value="AMAMAPARE, PAPUA NEW GUINEA">
                  AMAMAPARE, PAPUA NEW GUINEA
                </option>

                <option value="AMAPALA, HOND.">AMAPALA, HOND.</option>

                <option value="AMBARLI (ISTANBUL), TURKEY">
                  AMBARLI (ISTANBUL), TURKEY
                </option>

                <option value="AMBARLI ISTANBUL SEAPORT ">
                  AMBARLI ISTANBUL SEAPORT{" "}
                </option>

                <option value="AMBARLI PORT ,ISTANBUL IN TURKIYE ">
                  AMBARLI PORT ,ISTANBUL IN TURKIYE{" "}
                </option>

                <option value="AMBARLI PORT, ISTANBUL, TURKEY">
                  AMBARLI PORT, ISTANBUL, TURKEY
                </option>

                <option value="AMBARLI SEAPORT, ISTANBUL ">
                  AMBARLI SEAPORT, ISTANBUL{" "}
                </option>

                <option value="AMBARLI, ISTANBUL">AMBARLI, ISTANBUL</option>

                <option value="AMBARLI,ISTANBUL,TURKEY">
                  AMBARLI,ISTANBUL,TURKEY
                </option>

                <option value="AMOY,XIAMEN:HSIA MEN, CHINA">
                  AMOY,XIAMEN:HSIA MEN, CHINA
                </option>

                <option value="AMPENAN; LEMBAR, JAVA">
                  AMPENAN; LEMBAR, JAVA
                </option>

                <option value="AMSTERDAM, NETHERLANDS">
                  AMSTERDAM, NETHERLANDS
                </option>

                <option value="AMUAY BAY, VENEZUELA">
                  AMUAY BAY, VENEZUELA
                </option>

                <option value="ANCON, PERU">ANCON, PERU</option>

                <option value="ANCONA SEAPORT IN EUROPE">
                  ANCONA SEAPORT IN EUROPE
                </option>

                <option value="ANCONA, ITALY">ANCONA, ITALY</option>

                <option value="ANDROS ISLAND, BAHAMAS">
                  ANDROS ISLAND, BAHAMAS
                </option>

                <option value="ANDROSSAN">ANDROSSAN</option>

                <option value="ANEWA BAY, PAPUA NEW GUINEA">
                  ANEWA BAY, PAPUA NEW GUINEA
                </option>

                <option value="ANGRA DOS REIS; TEBIG, BRAZIL">
                  ANGRA DOS REIS; TEBIG, BRAZIL
                </option>

                <option value="ANGUILLA, LEEWARD ISLANDS">
                  ANGUILLA, LEEWARD ISLANDS
                </option>

                <option value="ANTALYA">ANTALYA</option>

                <option value="ANTALYA; ATALIA; ADALIA, GREEC">
                  ANTALYA; ATALIA; ADALIA, GREEC
                </option>

                <option value="ANTAN TERMINAL, NIGERIA">
                  ANTAN TERMINAL, NIGERIA
                </option>

                <option value="ANTOFAGASTA, CHILE">ANTOFAGASTA, CHILE</option>

                <option value="ANTWERP">ANTWERP</option>

                <option value="ANTWERP PORT">ANTWERP PORT</option>

                <option value="ANTWERP SEAPORT">ANTWERP SEAPORT</option>

                <option value="ANTWERP, BELGIUM">ANTWERP, BELGIUM</option>

                <option value="ANTWERP. ANVERS, BELGIUM">
                  ANTWERP. ANVERS, BELGIUM
                </option>

                <option value="APAPA SEAPORT LAGOS NIGERIA">
                  APAPA SEAPORT LAGOS NIGERIA
                </option>

                <option value="APAPA, NIGERIA">APAPA, NIGERIA</option>

                <option value="AQABA SEAPORT, JORDAN ">
                  AQABA SEAPORT, JORDAN{" "}
                </option>

                <option value="AQABA, JORDAN">AQABA, JORDAN</option>

                <option value="AQABA; AL AQABAH, JORDAN">
                  AQABA; AL AQABAH, JORDAN
                </option>

                <option value="ARATU, BRAZIL">ARATU, BRAZIL</option>

                <option value="ARAWAK CAY, BAHAMAS">ARAWAK CAY, BAHAMAS</option>

                <option value="ARICA, CHILE">ARICA, CHILE</option>

                <option value="ARJUNA TERMINAL, JAVA">
                  ARJUNA TERMINAL, JAVA
                </option>

                <option value="ARKLOW, IRELAND">ARKLOW, IRELAND</option>

                <option value="ARZANAH ISLAND, ARAB EMIRATES">
                  ARZANAH ISLAND, ARAB EMIRATES
                </option>

                <option value="ARZEW. ALGERIA">ARZEW. ALGERIA</option>

                <option value="ASHDOD, ISRAEL">ASHDOD, ISRAEL</option>

                <option value="ASPROPIRGOS; ASPROPYRGOS, GR.">
                  ASPROPIRGOS; ASPROPYRGOS, GR.
                </option>

                <option value="ASSAB; ASEB, ERITREA">
                  ASSAB; ASEB, ERITREA
                </option>

                <option value="ASUNCION SEAPORT, PARAGUAY">
                  ASUNCION SEAPORT, PARAGUAY
                </option>

                <option value="ASUNCION, PARAGUAY">ASUNCION, PARAGUAY</option>

                <option value="ATTAKA">ATTAKA</option>

                <option value="AUCKLAND, NEW ZEALAND">
                  AUCKLAND, NEW ZEALAND
                </option>

                <option value="AUGHINISH, IRELAND">AUGHINISH, IRELAND</option>

                <option value="AUGUSTA, ITALY">AUGUSTA, ITALY</option>

                <option value="AUX CAYES, HAITI">AUX CAYES, HAITI</option>

                <option value="AVATIU, RAROTONGA COOK ISLAND">
                  AVATIU, RAROTONGA COOK ISLAND
                </option>

                <option value="AVEIRO, PORTUGAL">AVEIRO, PORTUGAL</option>

                <option value="AVILES; SAN JUAN DE NIEVA, SP">
                  AVILES; SAN JUAN DE NIEVA, SP
                </option>

                <option value="AVONMOUTH, ENGLAND">AVONMOUTH, ENGLAND</option>

                <option value="AYIA MARINA, GREECE">AYIA MARINA, GREECE</option>

                <option value="AYIA TRIAS; MEGARA, GREECE">
                  AYIA TRIAS; MEGARA, GREECE
                </option>

                <option value="AYIOS NIKOLAOS; NIKOLA, GREECE">
                  AYIOS NIKOLAOS; NIKOLA, GREECE
                </option>

                <option value="BAGNOLI, ITALY">BAGNOLI, ITALY</option>

                <option value="BAGUAL,ARGENTINA">BAGUAL,ARGENTINA</option>

                <option value="BAHIA BLANCA, ARG.">BAHIA BLANCA, ARG.</option>

                <option value="BAHIA DE CARAQUES, ECU">
                  BAHIA DE CARAQUES, ECU
                </option>

                <option value="BAHIA DE MOIN, COSTA RICA">
                  BAHIA DE MOIN, COSTA RICA
                </option>

                <option value="BAHRAIN">BAHRAIN</option>

                <option value="BAIS, PHILIPPINES">BAIS, PHILIPPINES</option>

                <option value="BAJO GRANDE, VENEZUELA">
                  BAJO GRANDE, VENEZUELA
                </option>

                <option value="BALAO; TEPRE, ECUADOR">
                  BALAO; TEPRE, ECUADOR
                </option>

                <option value="BALBOA PORT, ARICA">BALBOA PORT, ARICA</option>

                <option value="BALBOA, PAN.">BALBOA, PAN.</option>

                <option value="BALIKPAPAN, KALIMANTAN">
                  BALIKPAPAN, KALIMANTAN
                </option>

                <option value="BALONGAN TERMINAL, JAVA">
                  BALONGAN TERMINAL, JAVA
                </option>

                <option value="BANDIRMA; PANDERMA, TURKEY">
                  BANDIRMA; PANDERMA, TURKEY
                </option>

                <option value="BANGKOK">BANGKOK</option>

                <option value="BANGKOK (PAT),THAILAND">
                  BANGKOK (PAT),THAILAND
                </option>

                <option value="BANGKOK PORT">BANGKOK PORT</option>

                <option value="BANGKOK(BMTP),THAILAND">
                  BANGKOK(BMTP),THAILAND
                </option>

                <option value="BANGKOK, THAILAND">BANGKOK, THAILAND</option>

                <option value="BANGOR, NORTHERN IRELAND">
                  BANGOR, NORTHERN IRELAND
                </option>

                <option value="BANJARMASIN, INDONESIA">
                  BANJARMASIN, INDONESIA
                </option>

                <option value="BAR">BAR</option>

                <option value="BAR, YUGOSLAVIA">BAR, YUGOSLAVIA</option>

                <option value="BARAHONA, DOM. REP.">BARAHONA, DOM. REP.</option>

                <option value="BARAMA, BARAMANNI GUYANA">
                  BARAMA, BARAMANNI GUYANA
                </option>

                <option value="BARCADERA">BARCADERA</option>

                <option value="BARCELONA">BARCELONA</option>

                <option value="BARCELONA PORT,SPAIN">
                  BARCELONA PORT,SPAIN
                </option>

                <option value="BARCELONA, SPAIN">BARCELONA, SPAIN</option>

                <option value="BARI, ITALY">BARI, ITALY</option>

                <option value="BARLETTA, ITALY">BARLETTA, ITALY</option>

                <option value="BARRANQUILLA, COL.">BARRANQUILLA, COL.</option>

                <option value="BARREIRO, PORTUGAL">BARREIRO, PORTUGAL</option>

                <option value="BARRY, WALES">BARRY, WALES</option>

                <option value="BASSE TERRE, GUADELOUPE">
                  BASSE TERRE, GUADELOUPE
                </option>

                <option value="BASSENS, FRANCE">BASSENS, FRANCE</option>

                <option value="BASSETERRE, ST. KITTS">
                  BASSETERRE, ST. KITTS
                </option>

                <option value="BASUO; DONGFANG,  CHINA M">
                  BASUO; DONGFANG, CHINA M
                </option>

                <option value="BATAAN, PHILIPPINES">BATAAN, PHILIPPINES</option>

                <option value="BATANGAS, PHILIPPINES">
                  BATANGAS, PHILIPPINES
                </option>

                <option value="BATHURST; BANJUL, GAMBIA">
                  BATHURST; BANJUL, GAMBIA
                </option>

                <option value="BATUMI; BATUMIYSKAVA, GEORGIA">
                  BATUMI; BATUMIYSKAVA, GEORGIA
                </option>

                <option value="BAUAN, PHILIPPINES">BAUAN, PHILIPPINES</option>

                <option value="BAYONNE, FRANCE">BAYONNE, FRANCE</option>

                <option value="BEC DAMBES; AMBES, FRANCE">
                  BEC DAMBES; AMBES, FRANCE
                </option>

                <option value="BEDI;JAMNAGAR;SIKKA,  INDIA">
                  BEDI;JAMNAGAR;SIKKA, INDIA
                </option>

                <option value="BEI HAI/BEIHAI;PAKHOI;PAKHO,CH">
                  BEI HAI/BEIHAI;PAKHOI;PAKHO,CH
                </option>

                <option value="BEI JAO, CHINA M">BEI JAO, CHINA M</option>

                <option value="BEILUN, CHINA M">BEILUN, CHINA M</option>

                <option value="BEIRA, MOZAMBIQUE">BEIRA, MOZAMBIQUE</option>

                <option value="BEIRUT">BEIRUT</option>

                <option value="BEIRUT; BEYROUTH, LEBANON">
                  BEIRUT; BEYROUTH, LEBANON
                </option>

                <option value="BEJAIA,ALGERIA">BEJAIA,ALGERIA</option>

                <option value="BELAWAN, INDONESIA">BELAWAN, INDONESIA</option>

                <option value="BELAWAN, SUMATRA">BELAWAN, SUMATRA</option>

                <option value="BELEM;PARA;VILADOCONDE,BARCARE">
                  BELEM;PARA;VILADOCONDE,BARCARE
                </option>

                <option value="BELFAST, IRELAND">BELFAST, IRELAND</option>

                <option value="BELFAST, NORTHERN IRELAND">
                  BELFAST, NORTHERN IRELAND
                </option>

                <option value="BELGROD-DNESTROVSKIY, UKRAINE">
                  BELGROD-DNESTROVSKIY, UKRAINE
                </option>

                <option value="BELILING; BULELENG, BALI">
                  BELILING; BULELENG, BALI
                </option>

                <option value="BELIZE">BELIZE</option>

                <option value="BELL BAY, TASMANIA, AUSTRAL">
                  BELL BAY, TASMANIA, AUSTRAL
                </option>

                <option value="BENGKULU, SUMATRA">BENGKULU, SUMATRA</option>

                <option value="BENI SAF (BONE), ALGERIA">
                  BENI SAF (BONE), ALGERIA
                </option>

                <option value="BENOA, BALI">BENOA, BALI</option>

                <option value="BERBERA, SOMALIA">BERBERA, SOMALIA</option>

                <option value="BERDYANSK, UKRAINE">BERDYANSK, UKRAINE</option>

                <option value="BERGEN; AAGOTNES, NORWAY">
                  BERGEN; AAGOTNES, NORWAY
                </option>

                <option value="BERRE; ETANG DE BERRE, FRANCE">
                  BERRE; ETANG DE BERRE, FRANCE
                </option>

                <option value="BERWICK/BERWICK UPON TWEED, EN">
                  BERWICK/BERWICK UPON TWEED, EN
                </option>

                <option value="BEYPORE">BEYPORE</option>

                <option value="BHAVNAGAR, INDIA">BHAVNAGAR, INDIA</option>

                <option value="BIG CREEK, BELIZE">BIG CREEK, BELIZE</option>

                <option value="BILBAO, SPAIN">BILBAO, SPAIN</option>

                <option value="BIMA; BIMA TERMINAL, SUMATRA">
                  BIMA; BIMA TERMINAL, SUMATRA
                </option>

                <option value="BIMINI,GUN CAY,BAHAMAS">
                  BIMINI,GUN CAY,BAHAMAS
                </option>

                <option value="BINTULU, MALAYSIA">BINTULU, MALAYSIA</option>

                <option value="BIRKENHEAD, ENGLAND">BIRKENHEAD, ENGLAND</option>

                <option value="BISLIG, PHILIPPINES">BISLIG, PHILIPPINES</option>

                <option value="BITUNG, SULAWESI">BITUNG, SULAWESI</option>

                <option value="BIZERTE, TUNISIA">BIZERTE, TUNISIA</option>

                <option value="BJORNEBORG; PORI, FINLAND">
                  BJORNEBORG; PORI, FINLAND
                </option>

                <option value="BLAYE, FRANCE">BLAYE, FRANCE</option>

                <option value="BLUEFIELDS, EL BLUFF, NICAR.">
                  BLUEFIELDS, EL BLUFF, NICAR.
                </option>

                <option value="BLUFF HARBOR NEW ZEALAND">
                  BLUFF HARBOR NEW ZEALAND
                </option>

                <option value="BOCA CHICA, DOM. REP.">
                  BOCA CHICA, DOM. REP.
                </option>

                <option value="BODO, NORWAY">BODO, NORWAY</option>

                <option value="BOMA, ZAIRE">BOMA, ZAIRE</option>

                <option value="BONAIRE ISLAND, NETHRLDS ANTIL">
                  BONAIRE ISLAND, NETHRLDS ANTIL
                </option>

                <option value="BONNY, NIGERIA">BONNY, NIGERIA</option>

                <option value="BONTANG; BONTANG BAY, SUMATRA">
                  BONTANG; BONTANG BAY, SUMATRA
                </option>

                <option value="BORDEAUX, FRANCE">BORDEAUX, FRANCE</option>

                <option value="BOTANY BAY, AUSTRALIA">
                  BOTANY BAY, AUSTRALIA
                </option>

                <option value="BOTLEK, NETHERLANDS">BOTLEK, NETHERLANDS</option>

                <option value="BOULOGNE, FRANCE">BOULOGNE, FRANCE</option>

                <option value="BOURGAS, BULGARIA">BOURGAS, BULGARIA</option>

                <option value="BRAEFOOT BAY, SCOTLAND">
                  BRAEFOOT BAY, SCOTLAND
                </option>

                <option value="BRAKE, FR GERMANY">BRAKE, FR GERMANY</option>

                <option value="BRASS TERMINAL; BRASS, NIGERIA">
                  BRASS TERMINAL; BRASS, NIGERIA
                </option>

                <option value="BREMEN, FR GERMANY">BREMEN, FR GERMANY</option>

                <option value="BREMERHAVEN ">BREMERHAVEN </option>

                <option value="BREMERHAVEN, EUROPEAN SEAPORT">
                  BREMERHAVEN, EUROPEAN SEAPORT
                </option>

                <option value="BREMERHAVEN,GERMANY">BREMERHAVEN,GERMANY</option>

                <option value="BREMERHAVEN; BERHN, FR GERMANY">
                  BREMERHAVEN; BERHN, FR GERMANY
                </option>

                <option value="BREST, FRANCE">BREST, FRANCE</option>

                <option value="BREVES,BRAZIL">BREVES,BRAZIL</option>

                <option value="BREVIK, NORWAY">BREVIK, NORWAY</option>

                <option value="BRIDGETOWN, BARBADOS">
                  BRIDGETOWN, BARBADOS
                </option>

                <option value="BRINDISI, ITALY">BRINDISI, ITALY</option>

                <option value="BRISBANE">BRISBANE</option>

                <option value="BRISBANE, AUSTRALIA">BRISBANE, AUSTRALIA</option>

                <option value="BRISTOL; BEBINGTON, ENGLAND">
                  BRISTOL; BEBINGTON, ENGLAND
                </option>

                <option value="BROMSBOROUGH ENGLAND">
                  BROMSBOROUGH ENGLAND
                </option>

                <option value="BRUNSBUTTEL, FR GERMANY">
                  BRUNSBUTTEL, FR GERMANY
                </option>

                <option value="BRUSSELS; BRUXELLES, BELGIUM">
                  BRUSSELS; BRUXELLES, BELGIUM
                </option>

                <option value="BUDGE-BUDGE; BAJ-BAJ, INDIA">
                  BUDGE-BUDGE; BAJ-BAJ, INDIA
                </option>

                <option value="BUENAVENTURA">BUENAVENTURA</option>

                <option value="BUENAVENTURA - COLOMBIA ">
                  BUENAVENTURA - COLOMBIA{" "}
                </option>

                <option value="BUENAVENTURA, COL.">BUENAVENTURA, COL.</option>

                <option value="BUENAVENTURA, COLOMBIA ">
                  BUENAVENTURA, COLOMBIA{" "}
                </option>

                <option value="BUENOS AIRES">BUENOS AIRES</option>

                <option value="BUENOS AIRES, ARG.">BUENOS AIRES, ARG.</option>

                <option value="BUENOS AIRES, ARGENTINA">
                  BUENOS AIRES, ARGENTINA
                </option>

                <option value="BUKPYUNG,TONGHAE,REP OF KOREA">
                  BUKPYUNG,TONGHAE,REP OF KOREA
                </option>

                <option value="BUNBURY, AUS.">BUNBURY, AUS.</option>

                <option value="BUNDABERG, AUS.">BUNDABERG, AUS.</option>

                <option value="BURNIE, TASMANIA">BURNIE, TASMANIA</option>

                <option value="BUSAN PORT">BUSAN PORT</option>

                <option value="BUSAN PORT OF SOUTH KOREA">
                  BUSAN PORT OF SOUTH KOREA
                </option>

                <option value="BUSAN PORT, KOREA">BUSAN PORT, KOREA</option>

                <option value="BUSAN PORT, SOUTH KOREA">
                  BUSAN PORT, SOUTH KOREA
                </option>

                <option value="BUSAN SOUTH KOREA">BUSAN SOUTH KOREA</option>

                <option value="BUSAN, KOREA">BUSAN, KOREA</option>

                <option value="BUSAN, SOUTH KOREA">BUSAN, SOUTH KOREA</option>

                <option value="BUTTERWORTH,  MALAYSA">
                  BUTTERWORTH, MALAYSA
                </option>

                <option value="BUTUAN, PHILIPPINES">BUTUAN, PHILIPPINES</option>

                <option value="BUTZFLETH, FR GERMANY">
                  BUTZFLETH, FR GERMANY
                </option>

                <option value="CAACUPEMI ASUNCION">CAACUPEMI ASUNCION</option>

                <option value="CAACUPEMI ASUNCION, PARAGUAY">
                  CAACUPEMI ASUNCION, PARAGUAY
                </option>

                <option value="CABEDELO; JOAO PESSOA, BRAZIL">
                  CABEDELO; JOAO PESSOA, BRAZIL
                </option>

                <option value="CABINDA; TAKULA, ANGOLA">
                  CABINDA; TAKULA, ANGOLA
                </option>

                <option value="CABO ROJO, DOM. REP.">
                  CABO ROJO, DOM. REP.
                </option>

                <option value="CABO SAN LUCAS, MEX">CABO SAN LUCAS, MEX</option>

                <option value="CADIZ, SPAIN">CADIZ, SPAIN</option>

                <option value="CAEN, FRANCE">CAEN, FRANCE</option>

                <option value="CAGAYAN DE ORO; BUAYAN, PHIL.">
                  CAGAYAN DE ORO; BUAYAN, PHIL.
                </option>

                <option value="CAGLIARI, ITALY">CAGLIARI, ITALY</option>

                <option value="CALABAR, NIGERIA">CALABAR, NIGERIA</option>

                <option value="CALAIS, FRANCE">CALAIS, FRANCE</option>

                <option value="CALCUTTA, INDIA">CALCUTTA, INDIA</option>

                <option value="CALDERA BAY, DOM. REP.">
                  CALDERA BAY, DOM. REP.
                </option>

                <option value="CALDERA, CHILE">CALDERA, CHILE</option>

                <option value="CALDERA, COSTA RICA">CALDERA, COSTA RICA</option>

                <option value="CALETA OLIVIA(OLIVARES),ARGENT">
                  CALETA OLIVIA(OLIVARES),ARGENT
                </option>

                <option value="CALICA. MEXICO">CALICA. MEXICO</option>

                <option value="CALLAO PORT PERU">CALLAO PORT PERU</option>

                <option value="CALLAO, PERU">CALLAO, PERU</option>

                <option value="CAM RANH BAY, VIETNAM">
                  CAM RANH BAY, VIETNAM
                </option>

                <option value="CAMPANA, ARG.">CAMPANA, ARG.</option>

                <option value="CAMPECHE, MEX.">CAMPECHE, MEX.</option>

                <option value="CANCUN, MEXICO">CANCUN, MEXICO</option>

                <option value="CANNES, FRANCE">CANNES, FRANCE</option>

                <option value="CAP HAITIEN, HAITI">CAP HAITIEN, HAITI</option>

                <option value="CAPE LOPEZ, GABON">CAPE LOPEZ, GABON</option>

                <option value="CAPE TOWN">CAPE TOWN</option>

                <option value="CAPE TOWN, REP. OF S.AFR">
                  CAPE TOWN, REP. OF S.AFR
                </option>

                <option value="CAPE TOWN, SOUTH AFRICA">
                  CAPE TOWN, SOUTH AFRICA
                </option>

                <option value="CARACAS; LA GUAIRA, VENEZUELA">
                  CARACAS; LA GUAIRA, VENEZUELA
                </option>

                <option value="CARBONERAS, SPAIN">CARBONERAS, SPAIN</option>

                <option value="CARDIFF, WALES">CARDIFF, WALES</option>

                <option value="CARIPITO, VENEZUELA">CARIPITO, VENEZUELA</option>

                <option value="CARMEN, MEX.">CARMEN, MEX.</option>

                <option value="CARTAGENA">CARTAGENA</option>

                <option value="CARTAGENA COLOMBIA">CARTAGENA COLOMBIA</option>

                <option value="CARTAGENA, COLOMBIA">CARTAGENA, COLOMBIA</option>

                <option value="CARTAGENA, SPAIN">CARTAGENA, SPAIN</option>

                <option value="CARUPANO, VENEZUELA">CARUPANO, VENEZUELA</option>

                <option value="CASABLANCA ">CASABLANCA </option>

                <option value="CASABLANCA PORT">CASABLANCA PORT</option>

                <option value="CASABLANCA PORT, MOROCCO">
                  CASABLANCA PORT, MOROCCO
                </option>

                <option value="CASABLANCA, MOROCCO">CASABLANCA, MOROCCO</option>

                <option value="CASTAWAY CAY, BAHAMAS">
                  CASTAWAY CAY, BAHAMAS
                </option>

                <option value="CASTELLON, SPAIN">CASTELLON, SPAIN</option>

                <option value="CASTRIES, ST. LUCIA">CASTRIES, ST. LUCIA</option>

                <option value="CAT CAY, BAHAMAS, BAHAMAS">
                  CAT CAY, BAHAMAS, BAHAMAS
                </option>

                <option value="CAT ISLAND, BAHAMAS">CAT ISLAND, BAHAMAS</option>

                <option value="CATANIA">CATANIA</option>

                <option value="CATINIA, ITALY">CATINIA, ITALY</option>

                <option value="CAUCEDO">CAUCEDO</option>

                <option value="CAUCEDO, DOMINICAN REPUBLIC">
                  CAUCEDO, DOMINICAN REPUBLIC
                </option>

                <option value="CAYMAN BRAC, CAYMAN">CAYMAN BRAC, CAYMAN</option>

                <option value="CAYO ARCAS TERMINAL, MEX.">
                  CAYO ARCAS TERMINAL, MEX.
                </option>

                <option value="CEBU">CEBU</option>

                <option value="CEBU; SANGI, PHILIPPINES">
                  CEBU; SANGI, PHILIPPINES
                </option>

                <option value="CERROS ISL, CEDROS, MEX.">
                  CERROS ISL, CEDROS, MEX.
                </option>

                <option value="CEUTA, SPAIN">CEUTA, SPAIN</option>

                <option value="CHALNA; KHULNA, BANGLADESH">
                  CHALNA; KHULNA, BANGLADESH
                </option>

                <option value="CHANARAL;CALETA BARQUITO,CHILE">
                  CHANARAL;CALETA BARQUITO,CHILE
                </option>

                <option value="CHARLESTOWN, NEVIS ISLAND">
                  CHARLESTOWN, NEVIS ISLAND
                </option>

                <option value="CHARLOTTE AMALIE/ST THO,VIR IS">
                  CHARLOTTE AMALIE/ST THO,VIR IS
                </option>

                <option value="CHATTOGRAM SEAPORT ">CHATTOGRAM SEAPORT </option>

                <option value="CHATTOGRAM SEAPORT, BANGLADESH">
                  CHATTOGRAM SEAPORT, BANGLADESH
                </option>

                <option value="CHATTOGRAM, BANGLADESH">
                  CHATTOGRAM, BANGLADESH
                </option>

                <option value="CHEFOO/YANTAI/YENTAI, CHINA M">
                  CHEFOO/YANTAI/YENTAI, CHINA M
                </option>

                <option value="CHEN HAI; JINHAE, REP OF KOREA">
                  CHEN HAI; JINHAE, REP OF KOREA
                </option>

                <option value="CHENNAI">CHENNAI</option>

                <option value="CHENNAI PORT, INDIA ">
                  CHENNAI PORT, INDIA{" "}
                </option>

                <option value="CHENNAI SEA PORT, INDIA">
                  CHENNAI SEA PORT, INDIA
                </option>

                <option value="CHENNAI SEA, INDIA">CHENNAI SEA, INDIA</option>

                <option value="CHENNAI SEAPORT , INDIA">
                  CHENNAI SEAPORT , INDIA
                </option>

                <option value="CHENNAI, INDIA">CHENNAI, INDIA</option>

                <option value="CHERBOURG, FRANCE">CHERBOURG, FRANCE</option>

                <option value="CHETUMAL; MAHAHUAL, MEXICO">
                  CHETUMAL; MAHAHUAL, MEXICO
                </option>

                <option value="CHIN WANG TAO, CHINA M">
                  CHIN WANG TAO, CHINA M
                </option>

                <option value="CHIOGGIA, ITALY">CHIOGGIA, ITALY</option>

                <option value="CHIOS, GREECE">CHIOS, GREECE</option>

                <option value="CHIRIQUI GRANDE TERM, PAN.">
                  CHIRIQUI GRANDE TERM, PAN.
                </option>

                <option value="CHITTAGONG">CHITTAGONG</option>

                <option value="CHITTAGONG, BANGLADESH">
                  CHITTAGONG, BANGLADESH
                </option>

                <option value="CHIWAN">CHIWAN</option>

                <option value="CHIWAN, CHINA">CHIWAN, CHINA</option>

                <option value="CHIWAN, CHINA M">CHIWAN, CHINA M</option>

                <option value="CHONGQING ">CHONGQING </option>

                <option value="CHRISTCHURCH NEW ZEALAND">
                  CHRISTCHURCH NEW ZEALAND
                </option>

                <option value="CHRISTIANSTED, VIRGIN ISLAND">
                  CHRISTIANSTED, VIRGIN ISLAND
                </option>

                <option value="CHRISTMAS ISLAND">CHRISTMAS ISLAND</option>

                <option value="CHRISTMAS ISLAND, KIRIBAT">
                  CHRISTMAS ISLAND, KIRIBAT
                </option>

                <option value="CHUB CAY, BAHAMAS">CHUB CAY, BAHAMAS</option>

                <option value="CIGADING, INDONESIA">CIGADING, INDONESIA</option>

                <option value="CILACAP; TJILATJAP, JAVA">
                  CILACAP; TJILATJAP, JAVA
                </option>

                <option value="CINTA TERMINAL, JAVA">
                  CINTA TERMINAL, JAVA
                </option>

                <option value="CIUDAD BOLIVAR, VENEZUELA">
                  CIUDAD BOLIVAR, VENEZUELA
                </option>

                <option value="CIVITAVECCHIA, ITALY">
                  CIVITAVECCHIA, ITALY
                </option>

                <option value="CLARENCE RIVER, YAMBA, AUSTRAL">
                  CLARENCE RIVER, YAMBA, AUSTRAL
                </option>

                <option value="CLARENCE TOWN,LONG ISL, BAHAMA">
                  CLARENCE TOWN,LONG ISL, BAHAMA
                </option>

                <option value="CLIFTON POINT, BAHAMAS">
                  CLIFTON POINT, BAHAMAS
                </option>

                <option value="CLIPPERTON ISLAND">CLIPPERTON ISLAND</option>

                <option value="CLYDE, SCOTLAND">CLYDE, SCOTLAND</option>

                <option value="COCHIN, INDIA">COCHIN, INDIA</option>

                <option value="COCKBURN HARBOR,CAICOS ISLAND">
                  COCKBURN HARBOR,CAICOS ISLAND
                </option>

                <option value="COCO SOLO, PANAMA">COCO SOLO, PANAMA</option>

                <option value="COLOMBO">COLOMBO</option>

                <option value="COLOMBO, SRI LANKA ">COLOMBO, SRI LANKA </option>

                <option value="COLOMBO, SRI LANKA (CEYLON)">
                  COLOMBO, SRI LANKA (CEYLON)
                </option>

                <option value="COLON FREE ZONE ">COLON FREE ZONE </option>

                <option value="COLON FREE ZONE, PANAMA">
                  COLON FREE ZONE, PANAMA
                </option>

                <option value="COLORADO BAR, COSTA RICA">
                  COLORADO BAR, COSTA RICA
                </option>

                <option value="COMODORO RIVADAVIA, ARGENTINA">
                  COMODORO RIVADAVIA, ARGENTINA
                </option>

                <option value="CONAKRY: KONAKRI, GUINEA">
                  CONAKRY: KONAKRI, GUINEA
                </option>

                <option value="CONCHAN, PERU">CONCHAN, PERU</option>

                <option value="CONSTANTA, ROMANIA">CONSTANTA, ROMANIA</option>

                <option value="CONSTANTA; CONSTANTZA, ROMANIA">
                  CONSTANTA; CONSTANTZA, ROMANIA
                </option>

                <option value="COPENHAGEN, DENMARK">COPENHAGEN, DENMARK</option>

                <option value="COPENHAGEN; KOBENHAVN, DENMARK">
                  COPENHAGEN; KOBENHAVN, DENMARK
                </option>

                <option value="COQUIMBO, CHILE">COQUIMBO, CHILE</option>

                <option value="CORFU, GREECE">CORFU, GREECE</option>

                <option value="CORINTH; KORINTHOS, GREECE">
                  CORINTH; KORINTHOS, GREECE
                </option>

                <option value="CORINTO ">CORINTO </option>

                <option value="CORINTO, NICAR.">CORINTO, NICAR.</option>

                <option value="CORK">CORK</option>

                <option value="CORK; COBN, IRELAND">CORK; COBN, IRELAND</option>

                <option value="CORO, VENEZUELA">CORO, VENEZUELA</option>

                <option value="CORONEL, CHILE ">CORONEL, CHILE </option>

                <option value="COTONOU PORT - BENIN">
                  COTONOU PORT - BENIN
                </option>

                <option value="COTONOU, BENIN">COTONOU, BENIN</option>

                <option value="COVENAS, COLUMBIA">COVENAS, COLUMBIA</option>

                <option value="COZUMEL ISLAND,PUNTA VENADO,MX">
                  COZUMEL ISLAND,PUNTA VENADO,MX
                </option>

                <option value="CRISTOBAL, PAN.">CRISTOBAL, PAN.</option>

                <option value="CROTONE; MANFREDONIA, ITALY">
                  CROTONE; MANFREDONIA, ITALY
                </option>

                <option value="CRUZ BAY, ST. JOHN ISLAND">
                  CRUZ BAY, ST. JOHN ISLAND
                </option>

                <option value="CUL DE SAC, ST. LUCIA">
                  CUL DE SAC, ST. LUCIA
                </option>

                <option value="CUMAREBO, VENEZUELA">CUMAREBO, VENEZUELA</option>

                <option value="CURACAO ISLAND, NETHRLD ANTIL">
                  CURACAO ISLAND, NETHRLD ANTIL
                </option>

                <option value="CUXHAVEN, FR GERMANY">
                  CUXHAVEN, FR GERMANY
                </option>

                <option value="DA CHAN BAY, CHINA">DA CHAN BAY, CHINA</option>

                <option value="DA NANG, VIETNAM">DA NANG, VIETNAM</option>

                <option value="DA NANG; TOURANE, VIET NAM">
                  DA NANG; TOURANE, VIET NAM
                </option>

                <option value="DADIANGAS; GENERAL SANTOS, PHL">
                  DADIANGAS; GENERAL SANTOS, PHL
                </option>

                <option value="DAESAN, REP OF KOREA">
                  DAESAN, REP OF KOREA
                </option>

                <option value="DAGENHAM, ENGLAND">DAGENHAM, ENGLAND</option>

                <option value="DAIREN; DALIAN; LUDA, CHINA M">
                  DAIREN; DALIAN; LUDA, CHINA M
                </option>

                <option value="DAKAR (SENEGAL) ">DAKAR (SENEGAL) </option>

                <option value="DAKAR, SENEGAL">DAKAR, SENEGAL</option>

                <option value="DALIAN">DALIAN</option>

                <option value="DALRYMPLE BAY; HAY POINT, AUST">
                  DALRYMPLE BAY; HAY POINT, AUST
                </option>

                <option value="DAMIETTA SEAPORT, EGYPT">
                  DAMIETTA SEAPORT, EGYPT
                </option>

                <option value="DAMIETTA, EGYPT">DAMIETTA, EGYPT</option>

                <option value="DAMMAM SEAPORT">DAMMAM SEAPORT</option>

                <option value="DAMMAM, SAUDI ARABIA">
                  DAMMAM, SAUDI ARABIA
                </option>

                <option value="DAMPIER, AUS.">DAMPIER, AUS.</option>

                <option value="DAR ES SALAAM, TANZANIA">
                  DAR ES SALAAM, TANZANIA
                </option>

                <option value="DARCIA, TURKEY">DARCIA, TURKEY</option>

                <option value="DARWIN, AUSTRAL">DARWIN, AUSTRAL</option>

                <option value="DAS; DAS ISLAND, ARAB EMIRATES">
                  DAS; DAS ISLAND, ARAB EMIRATES
                </option>

                <option value="DAVAO, PHILIPPINES">DAVAO, PHILIPPINES</option>

                <option value="DEGRAD DES CANNES, FRENCH GUIA">
                  DEGRAD DES CANNES, FRENCH GUIA
                </option>

                <option value="DEKHEILA ALEXANDRIA">DEKHEILA ALEXANDRIA</option>

                <option value="DELFZIJL, NETHERLANDS">
                  DELFZIJL, NETHERLANDS
                </option>

                <option value="DERINCE; DERINDJE, TURKEY">
                  DERINCE; DERINDJE, TURKEY
                </option>

                <option value="DHAHRAN, SAUDI ARABIA">
                  DHAHRAN, SAUDI ARABIA
                </option>

                <option value="DHUBA/YAMBO/KING FAHD PT. S AR">
                  DHUBA/YAMBO/KING FAHD PT. S AR
                </option>

                <option value="DIEGO GARCIA, BRIT INDN OCEAN">
                  DIEGO GARCIA, BRIT INDN OCEAN
                </option>

                <option value="DIEPPE, FRANCE">DIEPPE, FRANCE</option>

                <option value="DIKILI, TURKEY">DIKILI, TURKEY</option>

                <option value="DJAKARTA; TANJUNG PRIOK, JAVA">
                  DJAKARTA; TANJUNG PRIOK, JAVA
                </option>

                <option value="DJIBOUTI, DJIBOUTI">DJIBOUTI, DJIBOUTI</option>

                <option value="DOHA, QATAR">DOHA, QATAR</option>

                <option value="DONGES, FRANCE">DONGES, FRANCE</option>

                <option value="DONGGUAN, CHINA">DONGGUAN, CHINA</option>

                <option value="DORDRECHT, NETHERLANDS">
                  DORDRECHT, NETHERLANDS
                </option>

                <option value="DOS BOCAS, MEX.">DOS BOCAS, MEX.</option>

                <option value="DOUALA PORT, CAMEROON">
                  DOUALA PORT, CAMEROON
                </option>

                <option value="DOVER, UNITED KINGDOM">
                  DOVER, UNITED KINGDOM
                </option>

                <option value="DRAMMEN, NORWAY">DRAMMEN, NORWAY</option>

                <option value="DROGHEDA, IRELAND">DROGHEDA, IRELAND</option>

                <option value="DUBAI">DUBAI</option>

                <option value="DUBAI PORT,U.A.E.">DUBAI PORT,U.A.E.</option>

                <option value="DUBAI UAE">DUBAI UAE</option>

                <option value="DUBAYY;DUBAI;PT RASHID, ARAB EM">
                  DUBAYY;DUBAI;PT RASHID, ARAB EM
                </option>

                <option value="DUBLIN">DUBLIN</option>

                <option value="DUBLIN, IRELAND">DUBLIN, IRELAND</option>

                <option value="DUBROVNIK; RAGUSA, CROATIA">
                  DUBROVNIK; RAGUSA, CROATIA
                </option>

                <option value="DUGI RAT, CROATIA">DUGI RAT, CROATIA</option>

                <option value="DUMAGUETE, PHILIPPINES">
                  DUMAGUETE, PHILIPPINES
                </option>

                <option value="DUMAI, SUMATRA">DUMAI, SUMATRA</option>

                <option value="DUNDEE, SCOTLAND">DUNDEE, SCOTLAND</option>

                <option value="DUNEDIN; OTAGO HARBOR, NEW ZEA">
                  DUNEDIN; OTAGO HARBOR, NEW ZEA
                </option>

                <option value="DUNKERQUE; DUNKIRK, FRANCE">
                  DUNKERQUE; DUNKIRK, FRANCE
                </option>

                <option value="DURBAN">DURBAN</option>

                <option value="DURBAN, SOUTH AFRICA">
                  DURBAN, SOUTH AFRICA
                </option>

                <option value="DURBAN,REP.OF SO.AFRICA">
                  DURBAN,REP.OF SO.AFRICA
                </option>

                <option value="DURRES; DURAZZO, ALBANIA">
                  DURRES; DURAZZO, ALBANIA
                </option>

                <option value="EAST LONDON, REP.SO.AFR.">
                  EAST LONDON, REP.SO.AFR.
                </option>

                <option value="EAST ZEIT BAY TERMINAL, EGYPT">
                  EAST ZEIT BAY TERMINAL, EGYPT
                </option>

                <option value="EASTHAM,  ENGLAND">EASTHAM, ENGLAND</option>

                <option value="EBEYE, ALL OTHER MARSHALLISL.">
                  EBEYE, ALL OTHER MARSHALLISL.
                </option>

                <option value="EDINBURG; LEITH, SCOTLAND">
                  EDINBURG; LEITH, SCOTLAND
                </option>

                <option value="EEMSHAVEN, NETHLDS">EEMSHAVEN, NETHLDS</option>

                <option value="EGERSUND,  NORWAY">EGERSUND, NORWAY</option>

                <option value="EINSWARDEN, FR GERMANY">
                  EINSWARDEN, FR GERMANY
                </option>

                <option value="EL CHAURE, VENEZUELA">
                  EL CHAURE, VENEZUELA
                </option>

                <option value="EL DEKHEILA">EL DEKHEILA</option>

                <option value="EL GUAMACHE">EL GUAMACHE</option>

                <option value="EL HAMRA/ALAMEIN/MERSA, EGYPT">
                  EL HAMRA/ALAMEIN/MERSA, EGYPT
                </option>

                <option value="EL ISMAILIYA, EGYPT">EL ISMAILIYA, EGYPT</option>

                <option value="EL JORF LASFAR, MOROCCO">
                  EL JORF LASFAR, MOROCCO
                </option>

                <option value="EL PALITO, VENEZUELA">
                  EL PALITO, VENEZUELA
                </option>

                <option value="EL SAUZAL, SAUZAL, MEXICO">
                  EL SAUZAL, SAUZAL, MEXICO
                </option>

                <option value="EL TABLAZO, VENEZUELA">
                  EL TABLAZO, VENEZUELA
                </option>

                <option value="ELAT; EILATH; EILAT, ISRAEL">
                  ELAT; EILATH; EILAT, ISRAEL
                </option>

                <option value="ELEFSIS; ELEUSIS, GREECE">
                  ELEFSIS; ELEUSIS, GREECE
                </option>

                <option value="ELEUTHERAISL,HASRBORISL,BAHAMA">
                  ELEUTHERAISL,HASRBORISL,BAHAMA
                </option>

                <option value="ELLESMERE; STANLOW, ENGLAND">
                  ELLESMERE; STANLOW, ENGLAND
                </option>

                <option value="ELSFLETH, GERMANY">ELSFLETH, GERMANY</option>

                <option value="EMDEN, FR GERMANY">EMDEN, FR GERMANY</option>

                <option value="ENGLISH HARBOR, KIRIBAT">
                  ENGLISH HARBOR, KIRIBAT
                </option>

                <option value="ENNORE PORT - INDIA ">
                  ENNORE PORT - INDIA{" "}
                </option>

                <option value="ENNORE, INDIA">ENNORE, INDIA</option>

                <option value="ENSENADA, MEX.">ENSENADA, MEX.</option>

                <option value="ENSTEAD/ENSTEADVAERKET, DEN.">
                  ENSTEAD/ENSTEADVAERKET, DEN.
                </option>

                <option value="EREGLI; UZUNKUM, TURKEY">
                  EREGLI; UZUNKUM, TURKEY
                </option>

                <option value="ERITH,  ENGLAND">ERITH, ENGLAND</option>

                <option value="ESBJERG, DENMARK">ESBJERG, DENMARK</option>

                <option value="ESCRAVOS OIL TERMINAL, NIGERIA">
                  ESCRAVOS OIL TERMINAL, NIGERIA
                </option>

                <option value="ESMERALDAS, ECU.">ESMERALDAS, ECU.</option>

                <option value="ESPERANCE, AUSTRALIA">
                  ESPERANCE, AUSTRALIA
                </option>

                <option value="EUROPOORT, NETHERLANDS">
                  EUROPOORT, NETHERLANDS
                </option>

                <option value="EVERTON, GUYANA">EVERTON, GUYANA</option>

                <option value="EVYAP PORT, TURKEY">EVYAP PORT, TURKEY</option>

                <option value="EXUMA, BAHAMAS">EXUMA, BAHAMAS</option>

                <option value="EYDEHAMN, NORWAY">EYDEHAMN, NORWAY</option>

                <option value="FALKENBERG, SWEDEN">FALKENBERG, SWEDEN</option>

                <option value="FALMOUTH, ENGLAND">FALMOUTH, ENGLAND</option>

                <option value="FANG CHENG; FANGCHENG, CHINA M">
                  FANG CHENG; FANGCHENG, CHINA M
                </option>

                <option value="FANNING, ISLAND">FANNING, ISLAND</option>

                <option value="FARSUND,  NORWAY">FARSUND, NORWAY</option>

                <option value="FATEH TERMINAL, ARAB EMIRATES">
                  FATEH TERMINAL, ARAB EMIRATES
                </option>

                <option value="FAWLEY, ENGLAND">FAWLEY, ENGLAND</option>

                <option value="FELIXSTOWE, ENGLAND">FELIXSTOWE, ENGLAND</option>

                <option value="FELIXSTOWE, U.K.">FELIXSTOWE, U.K.</option>

                <option value="FERROL, SPAIN">FERROL, SPAIN</option>

                <option value="FIGUEIRA DA FOZ, PORTUGAL">
                  FIGUEIRA DA FOZ, PORTUGAL
                </option>

                <option value="FLORO, NORWAY">FLORO, NORWAY</option>

                <option value="FLOTTA, SCOTLAND">FLOTTA, SCOTLAND</option>

                <option value="FORCADOS TERMINAL; FORCADOS,NG">
                  FORCADOS TERMINAL; FORCADOS,NG
                </option>

                <option value="FOREIGN TRADE ZONE IN USA">
                  FOREIGN TRADE ZONE IN USA
                </option>

                <option value="FORT BAY; FORT BAII, ARUBA">
                  FORT BAY; FORT BAII, ARUBA
                </option>

                <option value="FORT DE FRANCE, MARTINIQUE">
                  FORT DE FRANCE, MARTINIQUE
                </option>

                <option value="FORT LIBERTE, HAITI">FORT LIBERTE, HAITI</option>

                <option value="FORTALEZA;CEARA;MUCURIPE,BRAZ">
                  FORTALEZA;CEARA;MUCURIPE,BRAZ
                </option>

                <option value="FOS SUR MER; FOS, FRANCE">
                  FOS SUR MER; FOS, FRANCE
                </option>

                <option value="FOWEY, ENGLAND">FOWEY, ENGLAND</option>

                <option value="FOYNES, IRELAND">FOYNES, IRELAND</option>

                <option value="FREDERICIA, DENMARK">FREDERICIA, DENMARK</option>

                <option value="FREDERIKSHAVN, DENMARK">
                  FREDERIKSHAVN, DENMARK
                </option>

                <option value="FREDERIKSTED, VIRGIN ISLANDS">
                  FREDERIKSTED, VIRGIN ISLANDS
                </option>

                <option value="FREDRIKSTAD, NORWAY">FREDRIKSTAD, NORWAY</option>

                <option value="FREEPORT AND ALL OF GRAND BAHAMA ISLAND">
                  FREEPORT AND ALL OF GRAND BAHAMA ISLAND
                </option>

                <option value="FREETOWN, SIERRA LEONE">
                  FREETOWN, SIERRA LEONE
                </option>

                <option value="FREMANTLE">FREMANTLE</option>

                <option value="FREMANTLE, AUSTRALIA">
                  FREMANTLE, AUSTRALIA
                </option>

                <option value="FRESHCREEK;ALLOTHERBAHAMASPORT">
                  FRESHCREEK;ALLOTHERBAHAMASPORT
                </option>

                <option value="FUJAIRAH, ARAB EM">FUJAIRAH, ARAB EM</option>

                <option value="FUNAFUTI, ISLAND">FUNAFUTI, ISLAND</option>

                <option value="FUNCHAL, PORTUGAL">FUNCHAL, PORTUGAL</option>

                <option value="FUZHOU">FUZHOU</option>

                <option value="FUZHOU, CHINA">FUZHOU, CHINA</option>

                <option value="FUZHOU; FUCHOU; FOOCHOU; CHINA">
                  FUZHOU; FUCHOU; FOOCHOU; CHINA
                </option>

                <option value="GABES, TUNISIA">GABES, TUNISIA</option>

                <option value="GADDVIK, SWEDEN">GADDVIK, SWEDEN</option>

                <option value="GAETA, ITALY">GAETA, ITALY</option>

                <option value="GALEOTA POINT, TRINIDAD">
                  GALEOTA POINT, TRINIDAD
                </option>

                <option value="GAMBA, GABON">GAMBA, GABON</option>

                <option value="GAND; GENT; GHENT, BELGIUM">
                  GAND; GENT; GHENT, BELGIUM
                </option>

                <option value="GANDIA, SPAIN">GANDIA, SPAIN</option>

                <option value="GAROUA">GAROUA</option>

                <option value="GAVLE; GEFLE, SWEDEN">
                  GAVLE; GEFLE, SWEDEN
                </option>

                <option value="GDANSK">GDANSK</option>

                <option value="GDANSK; DANZIG, POLAND">
                  GDANSK; DANZIG, POLAND
                </option>

                <option value="GDYNIA">GDYNIA</option>

                <option value="GDYNIA, POLAND">GDYNIA, POLAND</option>

                <option value="GEBZE PORT,TURKIYE ">GEBZE PORT,TURKIYE </option>

                <option value="GEBZE; PURSAN, TURKEY">
                  GEBZE; PURSAN, TURKEY
                </option>

                <option value="GEELONG CITY, AUS.">GEELONG CITY, AUS.</option>

                <option value="GELA; TERRANOVA, ITALY">
                  GELA; TERRANOVA, ITALY
                </option>

                <option value="GEMLIK PORT, TURKEY ">
                  GEMLIK PORT, TURKEY{" "}
                </option>

                <option value="GEMLIK, TURKEY">GEMLIK, TURKEY</option>

                <option value="GENERAL SANTOS, PH ">GENERAL SANTOS, PH </option>

                <option value="GENOA">GENOA</option>

                <option value="GENOA ITALIAN PORT">GENOA ITALIAN PORT</option>

                <option value="GENOA ITALIAN SEA PORT">
                  GENOA ITALIAN SEA PORT
                </option>

                <option value="GENOA PORT OF ITALY">GENOA PORT OF ITALY</option>

                <option value="GENOA SEAPORT IN ITALY ">
                  GENOA SEAPORT IN ITALY{" "}
                </option>

                <option value="GENOA,ITALY">GENOA,ITALY</option>

                <option value="GENOA; GENOVA, ITALY">
                  GENOA; GENOVA, ITALY
                </option>

                <option value="GENOVA">GENOVA</option>

                <option value="GENOVA PORT IN ITALY">
                  GENOVA PORT IN ITALY
                </option>

                <option value="GENOVA SECH ">GENOVA SECH </option>

                <option value="GEORGETN/ASCENSION/CLARENCE">
                  GEORGETN/ASCENSION/CLARENCE
                </option>

                <option value="GEORGETOWN, GRAND CAYMAN">
                  GEORGETOWN, GRAND CAYMAN
                </option>

                <option value="GEORGETOWN, GUYANA">GEORGETOWN, GUYANA</option>

                <option value="GERALDTON, AUS.">GERALDTON, AUS.</option>

                <option value="GHAZAWET/GHAZAOUET/NEMOURS, AL">
                  GHAZAWET/GHAZAOUET/NEMOURS, AL
                </option>

                <option value="GIBRALTAR">GIBRALTAR</option>

                <option value="GIJON; MOSEL, SPAIN">GIJON; MOSEL, SPAIN</option>

                <option value="GIOIA TAURO, ITALY">GIOIA TAURO, ITALY</option>

                <option value="GIRESUN, TURKEY">GIRESUN, TURKEY</option>

                <option value="GISBORNE, NEW ZEALAND">
                  GISBORNE, NEW ZEALAND
                </option>

                <option value="GIZAN, SAUDI ARABIA">GIZAN, SAUDI ARABIA</option>

                <option value="GLADSTONE, AUS.">GLADSTONE, AUS.</option>

                <option value="GLASGOW, SCOTLAND">GLASGOW, SCOTLAND</option>

                <option value="GOCEK LIMAN, TURKEY">GOCEK LIMAN, TURKEY</option>

                <option value="GODTHAB; GODTHAAB,GREENLAND">
                  GODTHAB; GODTHAAB,GREENLAND
                </option>

                <option value="GOLFITO, COSTA RICA">GOLFITO, COSTA RICA</option>

                <option value="GOLFO DE PALMAS;ORISTANO, ITAL">
                  GOLFO DE PALMAS;ORISTANO, ITAL
                </option>

                <option value="GOLFO DE PARITA, PAN.">
                  GOLFO DE PARITA, PAN.
                </option>

                <option value="GONAIVES, HAITI">GONAIVES, HAITI</option>

                <option value="GOOLE,  ENGLAND">GOOLE, ENGLAND</option>

                <option value="GORDACAY;GREENTURTLE,COCOCAYBA">
                  GORDACAY;GREENTURTLE,COCOCAYBA
                </option>

                <option value="GOTEBORG; GOTHENBURG, SWEDEN">
                  GOTEBORG; GOTHENBURG, SWEDEN
                </option>

                <option value="GOVE, AUSTRAL">GOVE, AUSTRAL</option>

                <option value="GOVERNORS HARBOUR, BAHAMAS">
                  GOVERNORS HARBOUR, BAHAMAS
                </option>

                <option value="GRAND TURK, TURKS AND CAICOS I">
                  GRAND TURK, TURKS AND CAICOS I
                </option>

                <option value="GRANDE ANSE GRENADA">GRANDE ANSE GRENADA</option>

                <option value="GRANGEMOUTH, SCOTLAND">
                  GRANGEMOUTH, SCOTLAND
                </option>

                <option value="GREAT HARBOUR CAY, BAHAMAS">
                  GREAT HARBOUR CAY, BAHAMAS
                </option>

                <option value="GREAT INAGUA, BAHAMAS">
                  GREAT INAGUA, BAHAMAS
                </option>

                <option value="GREAT STIRRUP CAY, BAHAMAS">
                  GREAT STIRRUP CAY, BAHAMAS
                </option>

                <option value="GREENHITE; GREENHITHE, ENGLAND">
                  GREENHITE; GREENHITHE, ENGLAND
                </option>

                <option value="GREENOCK, SCOTLAND">GREENOCK, SCOTLAND</option>

                <option value="GREENORE, IRELAND">GREENORE, IRELAND</option>

                <option value="GRESIK, JAVA">GRESIK, JAVA</option>

                <option value="GRUNDARFJORDUR, ICELAND">
                  GRUNDARFJORDUR, ICELAND
                </option>

                <option value="GTI, INDIA">GTI, INDIA</option>

                <option value="GUANAJA, HONDURAS">GUANAJA, HONDURAS</option>

                <option value="GUANGZHOU/QUANZHOU, CHINA M">
                  GUANGZHOU/QUANZHOU, CHINA M
                </option>

                <option value="GUANTA, VENEZUELA">GUANTA, VENEZUELA</option>

                <option value="GUARANAO, VENEZUELA">GUARANAO, VENEZUELA</option>

                <option value="GUAYACAN, CHILE">GUAYACAN, CHILE</option>

                <option value="GUAYAQUIL,ECUADOR">GUAYAQUIL,ECUADOR</option>

                <option value="GUAYAQUIL;DURAN, ECUADOR">
                  GUAYAQUIL;DURAN, ECUADOR
                </option>

                <option value="GUAYMAS, MEX.">GUAYMAS, MEX.</option>

                <option value="GUJARAT">GUJARAT</option>

                <option value="GULF OF MEX TNKR TRNS PT">
                  GULF OF MEX TNKR TRNS PT
                </option>

                <option value="GULFHAVN, DENMARK">GULFHAVN, DENMARK</option>

                <option value="HADERA, ISRAEL">HADERA, ISRAEL</option>

                <option value="HADERSLEV, DENMARK">HADERSLEV, DENMARK</option>

                <option value="HAFNARFJORDHUR, ICELAND">
                  HAFNARFJORDHUR, ICELAND
                </option>

                <option value="HAI PHONG PORT, VIETNAM">
                  HAI PHONG PORT, VIETNAM
                </option>

                <option value="HAI PHONG; HAIPHONG, VIETMAN">
                  HAI PHONG; HAIPHONG, VIETMAN
                </option>

                <option value="HAIFA, ISRAEL">HAIFA, ISRAEL</option>

                <option value="HAIKOU,  CHINA M">HAIKOU, CHINA M</option>

                <option value="HAIPHONG PORT, VIETNAM">
                  HAIPHONG PORT, VIETNAM
                </option>

                <option value="HAIPHONG, VIETNAM">HAIPHONG, VIETNAM</option>

                <option value="HALDEN, NOR.">HALDEN, NOR.</option>

                <option value="HALDIA, INDIA">HALDIA, INDIA</option>

                <option value="HALF MOON CAY,BAHAMAS">
                  HALF MOON CAY,BAHAMAS
                </option>

                <option value="HALLSTAVIK, SWEDEN">HALLSTAVIK, SWEDEN</option>

                <option value="HALMSTAD, SWEDEN">HALMSTAD, SWEDEN</option>

                <option value="HALSINGBORG, SWEDEN">HALSINGBORG, SWEDEN</option>

                <option value="HAMAD, QATAR">HAMAD, QATAR</option>

                <option value="HAMBURG">HAMBURG</option>

                <option value="HAMBURG GERMAN SEAPORT">
                  HAMBURG GERMAN SEAPORT
                </option>

                <option value="HAMBURG PORT, GERMANY">
                  HAMBURG PORT, GERMANY
                </option>

                <option value="HAMBURG SEAPORT, GERMANY">
                  HAMBURG SEAPORT, GERMANY
                </option>

                <option value="HAMBURG, EUROPEAN SEAPORT">
                  HAMBURG, EUROPEAN SEAPORT
                </option>

                <option value="HAMBURG, GERMANY PORT ">
                  HAMBURG, GERMANY PORT{" "}
                </option>

                <option value="HAMBURG, W. GER.">HAMBURG, W. GER.</option>

                <option value="HAMBURG,GERMANY">HAMBURG,GERMANY</option>

                <option value="HAMILTON, BERMUDA">HAMILTON, BERMUDA</option>

                <option value="HAMINA;FREDRIKSHAMN, FINLAND">
                  HAMINA;FREDRIKSHAMN, FINLAND
                </option>

                <option value="HAMIRIYAH PORT">HAMIRIYAH PORT</option>

                <option value="HAMMERFEST, NORWAY">HAMMERFEST, NORWAY</option>

                <option value="HANKO; HANGO, FINLAND">
                  HANKO; HANGO, FINLAND
                </option>

                <option value="HANKOW; WUHAN, CHINA M">
                  HANKOW; WUHAN, CHINA M
                </option>

                <option value="HARBURG, FR GERMANY">HARBURG, FR GERMANY</option>

                <option value="HARTLEPOOL, ENGLAND">HARTLEPOOL, ENGLAND</option>

                <option value="HAUGESUND, NOR.">HAUGESUND, NOR.</option>

                <option value="HAYDARPASA, TURKEY">HAYDARPASA, TURKEY</option>

                <option value="HAZIRA PORT, INDIA">HAZIRA PORT, INDIA</option>

                <option value="HAZIRA, INDIA">HAZIRA, INDIA</option>

                <option value="HELSINGBORG ">HELSINGBORG </option>

                <option value="HELSINGBORG, SWEDEN ">
                  HELSINGBORG, SWEDEN{" "}
                </option>

                <option value="HELSINKI, FINLAND">HELSINKI, FINLAND</option>

                <option value="HELSINKI; HELSINGFORS, FINLAND">
                  HELSINKI; HELSINGFORS, FINLAND
                </option>

                <option value="HEMIKSEM;HIMIXEN, BELGIUM">
                  HEMIKSEM;HIMIXEN, BELGIUM
                </option>

                <option value="HERAKLION; IRAKLION, GREECE">
                  HERAKLION; IRAKLION, GREECE
                </option>

                <option value="HEROEN, NORWAY">HEROEN, NORWAY</option>

                <option value="HIGH SEAS TNKR TRANS PT">
                  HIGH SEAS TNKR TRANS PT
                </option>

                <option value="HO CHI MINH">HO CHI MINH</option>

                <option value="HO CHI MINH CITY (SAIGON),VNAM">
                  HO CHI MINH CITY (SAIGON),VNAM
                </option>

                <option value="HO CHI MINH CITY PORT, VIET NAM ">
                  HO CHI MINH CITY PORT, VIET NAM{" "}
                </option>

                <option value="HO CHI MINH CITY, VIET NAM">
                  HO CHI MINH CITY, VIET NAM
                </option>

                <option value="HOBART, TASMANIA">HOBART, TASMANIA</option>

                <option value="HOBRO, DENMARK">HOBRO, DENMARK</option>

                <option value="HOCHIMINH, VIETNAM">HOCHIMINH, VIETNAM</option>

                <option value="HODEIDA;AL HUDAYAH, YEMEN">
                  HODEIDA;AL HUDAYAH, YEMEN
                </option>

                <option value="HOGANAS, SWEDEN">HOGANAS, SWEDEN</option>

                <option value="HOLBAEK, DENMARK">HOLBAEK, DENMARK</option>

                <option value="HOLLA, NOR.">HOLLA, NOR.</option>

                <option value="HOLMSUND, SWEDEN">HOLMSUND, SWEDEN</option>

                <option value="HOLYHEAD, WALES">HOLYHEAD, WALES</option>

                <option value="HON GAI; HON GAY, VIETMAN">
                  HON GAI; HON GAY, VIETMAN
                </option>

                <option value="HONDAGUA, PHILIPPINES">
                  HONDAGUA, PHILIPPINES
                </option>

                <option value="HONG KONG">HONG KONG</option>

                <option value="HORSENS, DENMARK">HORSENS, DENMARK</option>

                <option value="HOUND POINT, SCOTLAND">
                  HOUND POINT, SCOTLAND
                </option>

                <option value="HSINKANG; XINGANG, CHINA M">
                  HSINKANG; XINGANG, CHINA M
                </option>

                <option value="HUALIEN, CHINA TAIWAN">
                  HUALIEN, CHINA TAIWAN
                </option>

                <option value="HUANG PU PORT, CHINA">
                  HUANG PU PORT, CHINA
                </option>

                <option value="HUANGPU, CHINA">HUANGPU, CHINA</option>

                <option value="HUANGPU; WHAMPOA, CHINA M">
                  HUANGPU; WHAMPOA, CHINA M
                </option>

                <option value="HUASCO, CHILE">HUASCO, CHILE</option>

                <option value="HUELVA, SPAIN">HUELVA, SPAIN</option>

                <option value="HULL, ENGLAND">HULL, ENGLAND</option>

                <option value="HUNTERSTON, SCOTLAND">
                  HUNTERSTON, SCOTLAND
                </option>

                <option value="IALI; YALI ISLAND, GREECE">
                  IALI; YALI ISLAND, GREECE
                </option>

                <option value="IBIZA, SPAIN">IBIZA, SPAIN</option>

                <option value="IGGESUND, SWEDEN">IGGESUND, SWEDEN</option>

                <option value="IJMUIDEN; YUMEDEN, NETHERLANDS">
                  IJMUIDEN; YUMEDEN, NETHERLANDS
                </option>

                <option value="ILHEUS; MALHADO, BRAZIL">
                  ILHEUS; MALHADO, BRAZIL
                </option>

                <option value="ILIGAN, PHILIPPINES">ILIGAN, PHILIPPINES</option>

                <option value="ILLICHEVSK; ILLYICHEVSK, UKRN">
                  ILLICHEVSK; ILLYICHEVSK, UKRN
                </option>

                <option value="ILO, PERU">ILO, PERU</option>

                <option value="ILOILO, PHILIPPINES">ILOILO, PHILIPPINES</option>

                <option value="IMBITUBA, BRAZIL">IMBITUBA, BRAZIL</option>

                <option value="IMMINGHAM, ENGLAND">IMMINGHAM, ENGLAND</option>

                <option value="INCHEON KOREAN PORT ">
                  INCHEON KOREAN PORT{" "}
                </option>

                <option value="INCHEON PORT">INCHEON PORT</option>

                <option value="INCHEON PORT KOREA">INCHEON PORT KOREA</option>

                <option value="INCHEON PORT SOUTH KOREA">
                  INCHEON PORT SOUTH KOREA
                </option>

                <option value="INCHEON PORT, KOREA">INCHEON PORT, KOREA</option>

                <option value="INCHEON PORT, SOUTH KOREA">
                  INCHEON PORT, SOUTH KOREA
                </option>

                <option value="INCHEON, SOUTH KOREA">
                  INCHEON, SOUTH KOREA
                </option>

                <option value="INCHON">INCHON</option>

                <option value="INCHON; JINSEN, REP. OF KOREA">
                  INCHON; JINSEN, REP. OF KOREA
                </option>

                <option value="INKOO; INGA, FINLAND">
                  INKOO; INGA, FINLAND
                </option>

                <option value="INVERKIP, SCOTLAND">INVERKIP, SCOTLAND</option>

                <option value="INVERNESS, SCOTLAND">INVERNESS, SCOTLAND</option>

                <option value="IQUIQUE, CHILE">IQUIQUE, CHILE</option>

                <option value="IQUITOS, PERU">IQUITOS, PERU</option>

                <option value="IRVINE, SCOTLAND">IRVINE, SCOTLAND</option>

                <option value="ISABEL, PHILIPPINES">ISABEL, PHILIPPINES</option>

                <option value="ISDEMIR, TURKEY">ISDEMIR, TURKEY</option>

                <option value="ISKENDERUN, TURKEY">ISKENDERUN, TURKEY</option>

                <option value="ISLA MUJERES, MEX.">ISLA MUJERES, MEX.</option>

                <option value="ISLAS CORONADOS, MEX.">
                  ISLAS CORONADOS, MEX.
                </option>

                <option value="ISTANBUL AMBARLI,TURKEY">
                  ISTANBUL AMBARLI,TURKEY
                </option>

                <option value="ISTANBUL KUMPORT,TURKEY ">
                  ISTANBUL KUMPORT,TURKEY{" "}
                </option>

                <option value="ISTANBUL SEAPORT,TURKEY ">
                  ISTANBUL SEAPORT,TURKEY{" "}
                </option>

                <option value="ISTANBUL TURKIYE">ISTANBUL TURKIYE</option>

                <option value="ISTANBUL, TURKEY ">ISTANBUL, TURKEY </option>

                <option value="ISTANBUL-AMBARLI TURKIYE ">
                  ISTANBUL-AMBARLI TURKIYE{" "}
                </option>

                <option value="ISTANBULCONSTANTINOPLE,AMBARLI">
                  ISTANBULCONSTANTINOPLE,AMBARLI
                </option>

                <option value="ITACOATIARA, BRAZ.">ITACOATIARA, BRAZ.</option>

                <option value="ITAGUAI, SEPETIBA BAY, BRAZIL">
                  ITAGUAI, SEPETIBA BAY, BRAZIL
                </option>

                <option value="ITAJAI">ITAJAI</option>

                <option value="ITAJAI - SC - BRAZIL">
                  ITAJAI - SC - BRAZIL
                </option>

                <option value="ITAJAI, BRAZ.">ITAJAI, BRAZ.</option>

                <option value="ITAPOA, BRAZIL">ITAPOA, BRAZIL</option>

                <option value="ITAQUI, BRAZIL">ITAQUI, BRAZIL</option>

                <option value="ITEA, GREECE">ITEA, GREECE</option>

                <option value="IZMIR - ALIAGA, TURKEY">
                  IZMIR - ALIAGA, TURKEY
                </option>

                <option value="IZMIR PORT, TURKIYE">IZMIR PORT, TURKIYE</option>

                <option value="IZMIR SEA PORT TURKEY">
                  IZMIR SEA PORT TURKEY
                </option>

                <option value="IZMIR SEAPORT, TURKEY ">
                  IZMIR SEAPORT, TURKEY{" "}
                </option>

                <option value="IZMIR, TURKEY">IZMIR, TURKEY</option>

                <option value="IZMIT">IZMIT</option>

                <option value="IZMIT EVYAP PORT TURKIYE">
                  IZMIT EVYAP PORT TURKIYE
                </option>

                <option value="IZMIT EVYAP PORT,TURKEY ">
                  IZMIT EVYAP PORT,TURKEY{" "}
                </option>

                <option value="IZMIT KORFEZI">IZMIT KORFEZI</option>

                <option value="IZMIT PORT, TURKEY">IZMIT PORT, TURKEY</option>

                <option value="IZMIT SEA PORT, TURKIYE">
                  IZMIT SEA PORT, TURKIYE
                </option>

                <option value="IZMIT TURKEY PORT ">IZMIT TURKEY PORT </option>

                <option value="IZMIT, KOCAELI, TURKIYE">
                  IZMIT, KOCAELI, TURKIYE
                </option>

                <option value="IZMIT, TURKEY">IZMIT, TURKEY</option>

                <option value="IZMIT,TUTUNCIFTLIK TURKEY">
                  IZMIT,TUTUNCIFTLIK TURKEY
                </option>

                <option value="IZMIT/EVYAP PORT,TURKEY">
                  IZMIT/EVYAP PORT,TURKEY
                </option>

                <option value="JACMEL, HAITI">JACMEL, HAITI</option>

                <option value="JAKARTA PORT, INDONESIA">
                  JAKARTA PORT, INDONESIA
                </option>

                <option value="JAKARTA UTARA, INDONESIA">
                  JAKARTA UTARA, INDONESIA
                </option>

                <option value="JAKARTA, INDONESIA">JAKARTA, INDONESIA</option>

                <option value="JAKARTA,INDONESIA">JAKARTA,INDONESIA</option>

                <option value="JAMBI; DJAMBI, SUMATRA">
                  JAMBI; DJAMBI, SUMATRA
                </option>

                <option value="JAWAHARLAL NEHRU; NAVA SHEVA">
                  JAWAHARLAL NEHRU; NAVA SHEVA
                </option>

                <option value="JEBEL ALI">JEBEL ALI</option>

                <option value="JEBEL ALI PORT">JEBEL ALI PORT</option>

                <option value="JEBEL ALI PORT, DUBAI, UAE">
                  JEBEL ALI PORT, DUBAI, UAE
                </option>

                <option value="JEBEL ALI, ARAB EM">JEBEL ALI, ARAB EM</option>

                <option value="JEBEL ALI, UAE">JEBEL ALI, UAE</option>

                <option value="JEBEL ALI,DUBAI">JEBEL ALI,DUBAI</option>

                <option value="JEBEL ALI,UNITED ARAB EMIRATES">
                  JEBEL ALI,UNITED ARAB EMIRATES
                </option>

                <option value="JEBEL DHANNA; RUWAIS, ARAB EM">
                  JEBEL DHANNA; RUWAIS, ARAB EM
                </option>

                <option value="JEDDAH">JEDDAH</option>

                <option value="JEDDAH PORT IN KINGDOM OF SAUDI ARABIA ">
                  JEDDAH PORT IN KINGDOM OF SAUDI ARABIA{" "}
                </option>

                <option value="JEDDAH, SAUDI ARABIAN SEAPORT ">
                  JEDDAH, SAUDI ARABIAN SEAPORT{" "}
                </option>

                <option value="JIANGYIN, CHINA">JIANGYIN, CHINA</option>

                <option value="JIUZHOU/ZHUHAI, CHINA M">
                  JIUZHOU/ZHUHAI, CHINA M
                </option>

                <option value="JNPT, INDIA">JNPT, INDIA</option>

                <option value="JOHORE;PASIR GUDANG,  MALAYSA">
                  JOHORE;PASIR GUDANG, MALAYSA
                </option>

                <option value="JOSE PANGANIBAN, PHILIPPINES">
                  JOSE PANGANIBAN, PHILIPPINES
                </option>

                <option value="JOSE,PUERTOJOSE,PETROZUATAVZ">
                  JOSE,PUERTOJOSE,PETROZUATAVZ
                </option>

                <option value="JUAYMAH, SAUDI AR.">JUAYMAH, SAUDI AR.</option>

                <option value="KALAMAI; CALAMATA, GREECE">
                  KALAMAI; CALAMATA, GREECE
                </option>

                <option value="KALAMAKI,GREECE">KALAMAKI,GREECE</option>

                <option value="KALI LIMENES (KALOI LIMNIONES)">
                  KALI LIMENES (KALOI LIMNIONES)
                </option>

                <option value="KALUNDBORG; ASNAES, DENMARK">
                  KALUNDBORG; ASNAES, DENMARK
                </option>

                <option value="KAMSAR, GUINEA">KAMSAR, GUINEA</option>

                <option value="KANDLA">KANDLA</option>

                <option value="KANDLA, INDIA">KANDLA, INDIA</option>

                <option value="KANTANG, THAILAND">KANTANG, THAILAND</option>

                <option value="KAOHSIUNG">KAOHSIUNG</option>

                <option value="KAOHSIUNG, CHINA(TAIWAN)">
                  KAOHSIUNG, CHINA(TAIWAN)
                </option>

                <option value="KAOHSIUNG, TAIWAN">KAOHSIUNG, TAIWAN</option>

                <option value="KARACHI">KARACHI</option>

                <option value="KARACHI PORT - PAKISTAN">
                  KARACHI PORT - PAKISTAN
                </option>

                <option value="KARACHI PORT, PAKISTAN">
                  KARACHI PORT, PAKISTAN
                </option>

                <option value="KARACHI PORT. PAKISTAN">
                  KARACHI PORT. PAKISTAN
                </option>

                <option value="KARACHI SEA PORT, PAKISTAN ">
                  KARACHI SEA PORT, PAKISTAN{" "}
                </option>

                <option value="KARACHI SEAPORT, PAKISTAN">
                  KARACHI SEAPORT, PAKISTAN
                </option>

                <option value="KARACHI, PAKISTAN">KARACHI, PAKISTAN</option>

                <option value="KARDELJEVO; PLOCE, CROATIA">
                  KARDELJEVO; PLOCE, CROATIA
                </option>

                <option value="KARLSBORG, SWEDEN">KARLSBORG, SWEDEN</option>

                <option value="KARLSHAMN, SWEDEN">KARLSHAMN, SWEDEN</option>

                <option value="KASIM; SORONG, WEST NEW GUINEA">
                  KASIM; SORONG, WEST NEW GUINEA
                </option>

                <option value="KATAKOLON, GREECE">KATAKOLON, GREECE</option>

                <option value="KATTUPALLI PORT, INDIA">
                  KATTUPALLI PORT, INDIA
                </option>

                <option value="KATTUPALLI SEA PORT INDIA ">
                  KATTUPALLI SEA PORT INDIA{" "}
                </option>

                <option value="KATTUPALLI, INDIA">KATTUPALLI, INDIA</option>

                <option value="KATTUPALLI,CHENNAI">KATTUPALLI,CHENNAI</option>

                <option value="KAVALA; CAVALA, GREECE">
                  KAVALA; CAVALA, GREECE
                </option>

                <option value="KAW-IBO TERMINAL; QUO IBOE, NG">
                  KAW-IBO TERMINAL; QUO IBOE, NG
                </option>

                <option value="KEELUNG">KEELUNG</option>

                <option value="KEELUNG, CHINA (TAIWAN)">
                  KEELUNG, CHINA (TAIWAN)
                </option>

                <option value="KEELUNG, TAIWAN">KEELUNG, TAIWAN</option>

                <option value="KELANG  PORT SWETTENHAM">
                  KELANG PORT SWETTENHAM
                </option>

                <option value="KEMI, FIN.">KEMI, FIN.</option>

                <option value="KENDIRI, INDONESIA">KENDIRI, INDONESIA</option>

                <option value="KERCH, UKRAINE">KERCH, UKRAINE</option>

                <option value="KERETH, MALAYSIA">KERETH, MALAYSIA</option>

                <option value="KHORFAKKAN, ARAB EM">KHORFAKKAN, ARAB EM</option>

                <option value="KIDJANG; SUNGAI KOLAK, RIOW IS">
                  KIDJANG; SUNGAI KOLAK, RIOW IS
                </option>

                <option value="KIEL; HOLTENAU, FR GERMANY">
                  KIEL; HOLTENAU, FR GERMANY
                </option>

                <option value="KILLINGHOLME, UNITED KINGDOM">
                  KILLINGHOLME, UNITED KINGDOM
                </option>

                <option value="KING ABDULLAH PORT">KING ABDULLAH PORT</option>

                <option value="KINGS NORTH; KINGSNORTH, ENG.">
                  KINGS NORTH; KINGSNORTH, ENG.
                </option>

                <option value="KINGSTON, JAMAICA">KINGSTON, JAMAICA</option>

                <option value="KINGSTOWN,ST.VINCENT/N GRENDIN">
                  KINGSTOWN,ST.VINCENT/N GRENDIN
                </option>

                <option value="KJOGE; KOGE, DENMARK">
                  KJOGE; KOGE, DENMARK
                </option>

                <option value="KLAIPEDA">KLAIPEDA</option>

                <option value="KLAIPEDA PORT, LITHUANIA">
                  KLAIPEDA PORT, LITHUANIA
                </option>

                <option value="KLAIPEDA, LITHUANIA">KLAIPEDA, LITHUANIA</option>

                <option value="KO SICHANG, THAILAND">
                  KO SICHANG, THAILAND
                </option>

                <option value="KOKO, NIGERIA">KOKO, NIGERIA</option>

                <option value="KOLDING, DENMARK">KOLDING, DENMARK</option>

                <option value="KOLKATA, INDIA">KOLKATA, INDIA</option>

                <option value="KOLKATA, SEAPORT">KOLKATA, SEAPORT</option>

                <option value="KOPER EUROPEAN PORT">KOPER EUROPEAN PORT</option>

                <option value="KOPER PORT IN EUROPE ">
                  KOPER PORT IN EUROPE{" "}
                </option>

                <option value="KOPER, SLOVENIA">KOPER, SLOVENIA</option>

                <option value="KOPER; KOPAR,  SLOVENIA">
                  KOPER; KOPAR, SLOVENIA
                </option>

                <option value="KORSOR, DENMARK">KORSOR, DENMARK</option>

                <option value="KOTA KINABALU, MALAYSIA">
                  KOTA KINABALU, MALAYSIA
                </option>

                <option value="KOTKA, FIN.">KOTKA, FIN.</option>

                <option value="KOVERHAR, FINLAND">KOVERHAR, FINLAND</option>

                <option value="KOWLOON, HONG KONG">KOWLOON, HONG KONG</option>

                <option value="KRIBI, CAMEROON">KRIBI, CAMEROON</option>

                <option value="KRISHNAPATNAM">KRISHNAPATNAM</option>

                <option value="KRISTIANSAND N,  NORWAY">
                  KRISTIANSAND N, NORWAY
                </option>

                <option value="KRISTIANSAND S,  NORWAY">
                  KRISTIANSAND S, NORWAY
                </option>

                <option value="KUALA SELANGOR,  MALAYSA">
                  KUALA SELANGOR, MALAYSA
                </option>

                <option value="KUALA TANJUNG, SUMATRA">
                  KUALA TANJUNG, SUMATRA
                </option>

                <option value="KUALA TERRENGGANU,  MALAYSA">
                  KUALA TERRENGGANU, MALAYSA
                </option>

                <option value="KUANTAN, MALAYSA">KUANTAN, MALAYSA</option>

                <option value="KUCHING, MALAYSIA">KUCHING, MALAYSIA</option>

                <option value="KUMPORT">KUMPORT</option>

                <option value="KUMPORT ISTANBUL TURKIYE ">
                  KUMPORT ISTANBUL TURKIYE{" "}
                </option>

                <option value="KUNSAN, KOREA">KUNSAN, KOREA</option>

                <option value="KUWAIT">KUWAIT</option>

                <option value="KUWAIT; AL KUWAIT, KUWAIT">
                  KUWAIT; AL KUWAIT, KUWAIT
                </option>

                <option value="KWANGYANG, KOR REP">KWANGYANG, KOR REP</option>

                <option value="KWINANA, AUS">KWINANA, AUS</option>

                <option value="KYMASSI, GREECE">KYMASSI, GREECE</option>

                <option value="KYNDBY, DENMARK">KYNDBY, DENMARK</option>

                <option value="LA CEIBA,UTILABAY HONDURAS">
                  LA CEIBA,UTILABAY HONDURAS
                </option>

                <option value="LA CORUNA; CORUNNA, SPAIN">
                  LA CORUNA; CORUNNA, SPAIN
                </option>

                <option value="LA GOULETTE, TUNISIA">
                  LA GOULETTE, TUNISIA
                </option>

                <option value="LA GUAIRA, VENEZUELA">
                  LA GUAIRA, VENEZUELA
                </option>

                <option value="LA LIBERTAD, ECU">LA LIBERTAD, ECU</option>

                <option value="LA PALLICE, FRANCE">LA PALLICE, FRANCE</option>

                <option value="LA PALMA, PAN.">LA PALMA, PAN.</option>

                <option value="LA PAMPILLA, PERU">LA PAMPILLA, PERU</option>

                <option value="LA PAZ, MEXICO">LA PAZ, MEXICO</option>

                <option value="LA PLATA, ARG.">LA PLATA, ARG.</option>

                <option value="LA ROMANA, DOM. REP.">
                  LA ROMANA, DOM. REP.
                </option>

                <option value="LA SALINA, VEN.">LA SALINA, VEN.</option>

                <option value="LA SKHIRA,  TUNISIA">LA SKHIRA, TUNISIA</option>

                <option value="LA SPEZIA PORT OF ITALY">
                  LA SPEZIA PORT OF ITALY
                </option>

                <option value="LA SPEZIA, ITALY">LA SPEZIA, ITALY</option>

                <option value="LA UNION, EL SALV.">LA UNION, EL SALV.</option>

                <option value="LAAYONNE, WESTERN SAHARA">
                  LAAYONNE, WESTERN SAHARA
                </option>

                <option value="LABADEE, HAITI">LABADEE, HAITI</option>

                <option value="LABUAN; VICTORIA, MALAYSIA">
                  LABUAN; VICTORIA, MALAYSIA
                </option>

                <option value="LAE, NEW GUINEA">LAE, NEW GUINEA</option>

                <option value="LAEM CHABANG">LAEM CHABANG</option>

                <option value="LAEM CHABANG PORT IN THAILAND">
                  LAEM CHABANG PORT IN THAILAND
                </option>

                <option value="LAEM CHABANG PORT, THAILAND ">
                  LAEM CHABANG PORT, THAILAND{" "}
                </option>

                <option value="LAEM CHABANG, THAILAND">
                  LAEM CHABANG, THAILAND
                </option>

                <option value="LAFITEAU, HAITI">LAFITEAU, HAITI</option>

                <option value="LAGOS; TIN CAN ISLAND, NIGERIA">
                  LAGOS; TIN CAN ISLAND, NIGERIA
                </option>

                <option value="LAHAD DATU, MALAYSIA">
                  LAHAD DATU, MALAYSIA
                </option>

                <option value="LALANG TERMINAL, JAVA">
                  LALANG TERMINAL, JAVA
                </option>

                <option value="LANDS END, ENGLAND">LANDS END, ENGLAND</option>

                <option value="LANSKRONA, SWEDEN">LANSKRONA, SWEDEN</option>

                <option value="LAPPAJARVI, FINLAND">LAPPAJARVI, FINLAND</option>

                <option value="LAPPOHJA, FINLAND">LAPPOHJA, FINLAND</option>

                <option value="LARNACA, CYPRUS">LARNACA, CYPRUS</option>

                <option value="LARVIK, NORWAY">LARVIK, NORWAY</option>

                <option value="LAS MINAS BAY, PAN">LAS MINAS BAY, PAN</option>

                <option value="LAS PALMAS, CANARY ISLANDS">
                  LAS PALMAS, CANARY ISLANDS
                </option>

                <option value="LAS PIEDRAS, VEN.">LAS PIEDRAS, VEN.</option>

                <option value="LAUNCESTON,TASMANIA">LAUNCESTON,TASMANIA</option>

                <option value="LAVERA, FRANCE">LAVERA, FRANCE</option>

                <option value="LAVERA: L`AVERA, FRANCE">
                  LAVERA: L`AVERA, FRANCE
                </option>

                <option value="LAWE LAWE TERMINAL, KALIMANTAN">
                  LAWE LAWE TERMINAL, KALIMANTAN
                </option>

                <option value="LAZARO CARDENAS, MEX.">
                  LAZARO CARDENAS, MEX.
                </option>

                <option value="LAZARO CARDENAS, MEXICO">
                  LAZARO CARDENAS, MEXICO
                </option>

                <option value="LE BOUCAU; BOUCAU, FRANCE">
                  LE BOUCAU; BOUCAU, FRANCE
                </option>

                <option value="LE HAVRE, FRANCE">LE HAVRE, FRANCE</option>

                <option value="LE VERDON; VERDON, FRANCE">
                  LE VERDON; VERDON, FRANCE
                </option>

                <option value="LEGASPI, PHILIPPINES">
                  LEGASPI, PHILIPPINES
                </option>

                <option value="LEGHORN, ITALY">LEGHORN, ITALY</option>

                <option value="LEGHORN; LIVORNO, ITALY">
                  LEGHORN; LIVORNO, ITALY
                </option>

                <option value="LEIXOES">LEIXOES</option>

                <option value="LEIXOES, PORTUGAL">LEIXOES, PORTUGAL</option>

                <option value="LIANYUNGANG">LIANYUNGANG</option>

                <option value="LIANYUNGANG, CHINA">LIANYUNGANG, CHINA</option>

                <option value="LIANYUNGANG, CHINA M">
                  LIANYUNGANG, CHINA M
                </option>

                <option value="LIBREVILLE, GABON">LIBREVILLE, GABON</option>

                <option value="LIEZEN, AUS.">LIEZEN, AUS.</option>

                <option value="LIMASSOL PORT, CYPRUS">
                  LIMASSOL PORT, CYPRUS
                </option>

                <option value="LIMASSOL, CYPRUS">LIMASSOL, CYPRUS</option>

                <option value="LIMAY, PHILIPPINES">LIMAY, PHILIPPINES</option>

                <option value="LIMBOH TERMINAL, VICTORIA CAM">
                  LIMBOH TERMINAL, VICTORIA CAM
                </option>

                <option value="LIMERICK, IRELAND">LIMERICK, IRELAND</option>

                <option value="LIMON, HOND.">LIMON, HOND.</option>

                <option value="LINDEN, GUYANA">LINDEN, GUYANA</option>

                <option value="LIPARI, ITALY">LIPARI, ITALY</option>

                <option value="LIRQUEN, CHILE">LIRQUEN, CHILE</option>

                <option value="LISBON, PORTUGAL ">LISBON, PORTUGAL </option>

                <option value="LISBON; LISBOA, PORTUGAL">
                  LISBON; LISBOA, PORTUGAL
                </option>

                <option value="LIVERPOOL, ENGLAND">LIVERPOOL, ENGLAND</option>

                <option value="LIVORNO">LIVORNO</option>

                <option value="LOBITO, ANGOLA">LOBITO, ANGOLA</option>

                <option value="LOMBO,PORTLOMBO,LOMBO TERMINAL">
                  LOMBO,PORTLOMBO,LOMBO TERMINAL
                </option>

                <option value="LOME, TOGO">LOME, TOGO</option>

                <option value="LONDON GATEWAY PORT, UNITED KINGDOM ">
                  LONDON GATEWAY PORT, UNITED KINGDOM{" "}
                </option>

                <option value="LONDON GATEWAY, UK">LONDON GATEWAY, UK</option>

                <option value="LONDON, ENGLAND">LONDON, ENGLAND</option>

                <option value="LONDONDERRY, NORTHERN IRELAND">
                  LONDONDERRY, NORTHERN IRELAND
                </option>

                <option value="LONGS WHARF, JAM.">LONGS WHARF, JAM.</option>

                <option value="LORIENT, FRANCE">LORIENT, FRANCE</option>

                <option value="LOVIISA; LOVISA, FINLAND">
                  LOVIISA; LOVISA, FINLAND
                </option>

                <option value="LUANDA, ANGOLA">LUANDA, ANGOLA</option>

                <option value="LUCINA, GABON">LUCINA, GABON</option>

                <option value="LULEA, SWEDEN">LULEA, SWEDEN</option>

                <option value="LUMUT,  MALAYSA">LUMUT, MALAYSA</option>

                <option value="LUPERON, DOMINICAN REPUBLIC">
                  LUPERON, DOMINICAN REPUBLIC
                </option>

                <option value="LUSHUN; PORT ARTHUR, CHINA M">
                  LUSHUN; PORT ARTHUR, CHINA M
                </option>

                <option value="LYTTLETON, NEW ZEALAND">
                  LYTTLETON, NEW ZEALAND
                </option>

                <option value="MAALOY, NORWAY">MAALOY, NORWAY</option>

                <option value="MACAO, MACAU">MACAO, MACAU</option>

                <option value="MACAPA; SANTANA, BRAZIL">
                  MACAPA; SANTANA, BRAZIL
                </option>

                <option value="MACASSAR, SULAWESI">MACASSAR, SULAWESI</option>

                <option value="MACEIO, BRAZ.">MACEIO, BRAZ.</option>

                <option value="MACKAY, AUSTRALIA">MACKAY, AUSTRALIA</option>

                <option value="MADRAS, INDIA">MADRAS, INDIA</option>

                <option value="MADRE DE DEUS, BRAZIL">
                  MADRE DE DEUS, BRAZIL
                </option>

                <option value="MAJORCA; PALMA DE MAJORCA, SP">
                  MAJORCA; PALMA DE MAJORCA, SP
                </option>

                <option value="MAKATEA, MAKATEA ISLANDS">
                  MAKATEA, MAKATEA ISLANDS
                </option>

                <option value="MALAGA, SPAIN">MALAGA, SPAIN</option>

                <option value="MALE, MALE ISLAND, MALDIVE">
                  MALE, MALE ISLAND, MALDIVE
                </option>

                <option value="MALMO; LIMHAMN, SWEDEN">
                  MALMO; LIMHAMN, SWEDEN
                </option>

                <option value="MALONGO OIL TERMINAL, ANGOLA">
                  MALONGO OIL TERMINAL, ANGOLA
                </option>

                <option value="MALTA (FREEPORT)">MALTA (FREEPORT)</option>

                <option value="MAMONAL, COL.">MAMONAL, COL.</option>

                <option value="MANAMA, BAHRAIN">MANAMA, BAHRAIN</option>

                <option value="MANAUS, BRAZ.">MANAUS, BRAZ.</option>

                <option value="MANCHESTER; ACTON GRANGE, ENG.">
                  MANCHESTER; ACTON GRANGE, ENG.
                </option>

                <option value="MANGONUI; MOUNT MAUNGANUI, N Z">
                  MANGONUI; MOUNT MAUNGANUI, N Z
                </option>

                <option value="MANILA NORTH, PHILIPPINES ">
                  MANILA NORTH, PHILIPPINES{" "}
                </option>

                <option value="MANILA SOUTH, PHILIPPINES">
                  MANILA SOUTH, PHILIPPINES
                </option>

                <option value="MANILA, PHILIPPINES">MANILA, PHILIPPINES</option>

                <option value="MANTA, ECU.">MANTA, ECU.</option>

                <option value="MANTYLUOTO, FIN.">MANTYLUOTO, FIN.</option>

                <option value="MANZANILLO BAY, DOM.REP">
                  MANZANILLO BAY, DOM.REP
                </option>

                <option value="MANZANILLO, (PUERTO) PANAMA">
                  MANZANILLO, (PUERTO) PANAMA
                </option>

                <option value="MANZANILLO, MEX.">MANZANILLO, MEX.</option>

                <option value="MANZANILLO, MEXICO">MANZANILLO, MEXICO</option>

                <option value="MAPUTO PORT, MOZAMBIQUE">
                  MAPUTO PORT, MOZAMBIQUE
                </option>

                <option value="MAPUTO, MOZAMBIQUE">MAPUTO, MOZAMBIQUE</option>

                <option value="MAR DEL PLATA, ARG.">MAR DEL PLATA, ARG.</option>

                <option value="MARACAIBO, VEN.">MARACAIBO, VEN.</option>

                <option value="MARDEJK, NETHERLANDS">
                  MARDEJK, NETHERLANDS
                </option>

                <option value="MARIGOT, ST. MARTIN, GUADELOUP">
                  MARIGOT, ST. MARTIN, GUADELOUP
                </option>

                <option value="MARIN, SPAIN">MARIN, SPAIN</option>

                <option value="MARINA DI CARRARA, ITALY">
                  MARINA DI CARRARA, ITALY
                </option>

                <option value="MARIUPOL; ZHDANOV, UKRAINE">
                  MARIUPOL; ZHDANOV, UKRAINE
                </option>

                <option value="MARIVELES, PHILIPPINES">
                  MARIVELES, PHILIPPINES
                </option>

                <option value="MARMAGAO BAY; GOA, INDIA">
                  MARMAGAO BAY; GOA, INDIA
                </option>

                <option value="MARPORT AMBRALI ISTANBUL ">
                  MARPORT AMBRALI ISTANBUL{" "}
                </option>

                <option value="MARPORT TERMINAL, AMBRALI ">
                  MARPORT TERMINAL, AMBRALI{" "}
                </option>

                <option value="MARQUESA ISLANDS">MARQUESA ISLANDS</option>

                <option value="MARSAXLOKK, MALTA">MARSAXLOKK, MALTA</option>

                <option value="MARSEILLE, FRANCE">MARSEILLE, FRANCE</option>

                <option value="MASAN, REP OF KOREA">MASAN, REP OF KOREA</option>

                <option value="MASERU, PHILLIPPINES">
                  MASERU, PHILLIPPINES
                </option>

                <option value="MASINLOC, PHILIPPINES">
                  MASINLOC, PHILIPPINES
                </option>

                <option value="MASIRAH, OMAN">MASIRAH, OMAN</option>

                <option value="MASSAWA; MASSAUA, ERITREA">
                  MASSAWA; MASSAUA, ERITREA
                </option>

                <option value="MATADI, ZAIRE">MATADI, ZAIRE</option>

                <option value="MATANZAS, VEN.">MATANZAS, VEN.</option>

                <option value="MATARANI, PERU">MATARANI, PERU</option>

                <option value="MAZATLAN, MEX.">MAZATLAN, MEX.</option>

                <option value="MCKENZIE, GUYANA">MCKENZIE, GUYANA</option>

                <option value="MELBOURNE">MELBOURNE</option>

                <option value="MELBOURNE, AUSTRALIA">
                  MELBOURNE, AUSTRALIA
                </option>

                <option value="MELBOURNE;YARRAVILLE,HASTINGAU">
                  MELBOURNE;YARRAVILLE,HASTINGAU
                </option>

                <option value="MEMEL; KLAIPEDA, LITHUANIA">
                  MEMEL; KLAIPEDA, LITHUANIA
                </option>

                <option value="MERAK, JAVA">MERAK, JAVA</option>

                <option value="MERSIN">MERSIN</option>

                <option value="MERSIN PORT, TURKEY ">
                  MERSIN PORT, TURKEY{" "}
                </option>

                <option value="MERSIN, TURKIYE ">MERSIN, TURKIYE </option>

                <option value="MERSIN,ADANA TURKEY">MERSIN,ADANA TURKEY</option>

                <option value="MIDDLESBROUGH, ENGLAND">
                  MIDDLESBROUGH, ENGLAND
                </option>

                <option value="MILAZZO, ITALY">MILAZZO, ITALY</option>

                <option value="MILFORD HAVEN, WALES">
                  MILFORD HAVEN, WALES
                </option>

                <option value="MILITARY-GERMERSHEIM">
                  MILITARY-GERMERSHEIM
                </option>

                <option value="MILITARY-MANNHEIM, GERMANY">
                  MILITARY-MANNHEIM, GERMANY
                </option>

                <option value="MILOS ISLAND, GREECE">
                  MILOS ISLAND, GREECE
                </option>

                <option value="MINA AL AHMADI;AL FUHAYHIL, KW">
                  MINA AL AHMADI;AL FUHAYHIL, KW
                </option>

                <option value="MINA AL FAHAL, OMAN">MINA AL FAHAL, OMAN</option>

                <option value="MINA SULMAN, BAHRAIN ISLAND">
                  MINA SULMAN, BAHRAIN ISLAND
                </option>

                <option value="MINA SUUD; MINA SAUD, KUWAIT">
                  MINA SUUD; MINA SAUD, KUWAIT
                </option>

                <option value="MINATITLAN, MEX.">MINATITLAN, MEX.</option>

                <option value="MINDELO;PORTO GRANDE,CAPE VERD">
                  MINDELO;PORTO GRANDE,CAPE VERD
                </option>

                <option value="MIRAGOANE, HAITI">MIRAGOANE, HAITI</option>

                <option value="MIRI, MALAYSIA">MIRI, MALAYSIA</option>

                <option value="MISAMIS; PORT OZAMIS, PHIL.">
                  MISAMIS; PORT OZAMIS, PHIL.
                </option>

                <option value="MO I RANA, NORWAY">MO I RANA, NORWAY</option>

                <option value="MOANDA TERMINAL, ZAIRE">
                  MOANDA TERMINAL, ZAIRE
                </option>

                <option value="MOCHA;AL MOKHA, YEMEN REPUBLIC">
                  MOCHA;AL MOKHA, YEMEN REPUBLIC
                </option>

                <option value="MOENGO, SURINAME">MOENGO, SURINAME</option>

                <option value="MOERDJIK, NETHERLANDS">
                  MOERDJIK, NETHERLANDS
                </option>

                <option value="MOGADISCIO, SOMALIA">MOGADISCIO, SOMALIA</option>

                <option value="MOHAMMEDIA, MOROCC0">MOHAMMEDIA, MOROCC0</option>

                <option value="MOIN (LIMON)">MOIN (LIMON)</option>

                <option value="MOKPO; POHANG HANG, REP OF KOR">
                  MOKPO; POHANG HANG, REP OF KOR
                </option>

                <option value="MOLLENDO, PERU">MOLLENDO, PERU</option>

                <option value="MOMBASA, KENYA">MOMBASA, KENYA</option>

                <option value="MOMBASA, PORT OF KENYA ">
                  MOMBASA, PORT OF KENYA{" "}
                </option>

                <option value="MOMBASA; KILINDINI, KENYA">
                  MOMBASA; KILINDINI, KENYA
                </option>

                <option value="MONACO (MONTE CARLO)">
                  MONACO (MONTE CARLO)
                </option>

                <option value="MONEY POINT, IRELAND">
                  MONEY POINT, IRELAND
                </option>

                <option value="MONFALCONE, ITALY">MONFALCONE, ITALY</option>

                <option value="MONGSTAD, NORWAY">MONGSTAD, NORWAY</option>

                <option value="MONTEGO BAY, JAMAICA">
                  MONTEGO BAY, JAMAICA
                </option>

                <option value="MONTEVIDEO">MONTEVIDEO</option>

                <option value="MONTEVIDEO, URUGUAY">MONTEVIDEO, URUGUAY</option>

                <option value="MONTOIR, FRANCE">MONTOIR, FRANCE</option>

                <option value="MONTROSE, SCOTLAND">MONTROSE, SCOTLAND</option>

                <option value="MORON, VEN">MORON, VEN</option>

                <option value="MOSS, NORWAY">MOSS, NORWAY</option>

                <option value="MOTRIL, SPAIN">MOTRIL, SPAIN</option>

                <option value="MOTUKEA ISLAND">MOTUKEA ISLAND</option>

                <option value="MOUDI TERMINAL, CAMEROON">
                  MOUDI TERMINAL, CAMEROON
                </option>

                <option value="MOURILYAN HARBOUR">MOURILYAN HARBOUR</option>

                <option value="MOZAMBIQUE ISLAND, MOZAMBIQUE">
                  MOZAMBIQUE ISLAND, MOZAMBIQUE
                </option>

                <option value="MUARA PORT, BRUNEI">MUARA PORT, BRUNEI</option>

                <option value="MUDANYA; MUDANIA, TURKEY">
                  MUDANYA; MUDANIA, TURKEY
                </option>

                <option value="MUMBAI (BOMBAY), INDIA">
                  MUMBAI (BOMBAY), INDIA
                </option>

                <option value="MUMBAI PORT">MUMBAI PORT</option>

                <option value="MUMBAI PORT (INDIA)">MUMBAI PORT (INDIA)</option>

                <option value="MUMBAI PORTS">MUMBAI PORTS</option>

                <option value="MUMBAI SEAPORT ">MUMBAI SEAPORT </option>

                <option value="MUMBAI, INDIA">MUMBAI, INDIA</option>

                <option value="MUNDRA">MUNDRA</option>

                <option value="MUNDRA PORT, INDIA">MUNDRA PORT, INDIA</option>

                <option value="MUNDRA SEAPORT, INDIA">
                  MUNDRA SEAPORT, INDIA
                </option>

                <option value="MUNDRA, INDIA">MUNDRA, INDIA</option>

                <option value="MUNGA, ESTONIA">MUNGA, ESTONIA</option>

                <option value="MUNGUBA, BRAZIL">MUNGUBA, BRAZIL</option>

                <option value="MUNTOK, BANGKA">MUNTOK, BANGKA</option>

                <option value="MUSAYID; UMM SAID, QATAR">
                  MUSAYID; UMM SAID, QATAR
                </option>

                <option value="MUSCAT,OMAN">MUSCAT,OMAN</option>

                <option value="MYKONOS; MIKONOS, GREECE">
                  MYKONOS; MIKONOS, GREECE
                </option>

                <option value="MYTILINI; MITILINI, GREECE">
                  MYTILINI; MITILINI, GREECE
                </option>

                <option value="N ATLANTIC TNKR TRANS PT">
                  N ATLANTIC TNKR TRANS PT
                </option>

                <option value="N. PACIFIC TNKR TRANS PT">
                  N. PACIFIC TNKR TRANS PT
                </option>

                <option value="NAANTALI, FIN.">NAANTALI, FIN.</option>

                <option value="NACALA, MOZAMBIQUE">NACALA, MOZAMBIQUE</option>

                <option value="NADOR, MOROCCO">NADOR, MOROCCO</option>

                <option value="NAKSKOV, DENMARK">NAKSKOV, DENMARK</option>

                <option value="NAMIBE, ANGOLA">NAMIBE, ANGOLA</option>

                <option value="NANJING">NANJING</option>

                <option value="NANKING, NANJING, CHINA M">
                  NANKING, NANJING, CHINA M
                </option>

                <option value="NANSHA">NANSHA</option>

                <option value="NANSHA, CHINA">NANSHA, CHINA</option>

                <option value="NANTES, FRANCE">NANTES, FRANCE</option>

                <option value="NANTONG, CHINA M">NANTONG, CHINA M</option>

                <option value="NAPIER, NEW ZEALAND">NAPIER, NEW ZEALAND</option>

                <option value="NAPLES">NAPLES</option>

                <option value="NAPLES; NAPOLI, ITALY">
                  NAPLES; NAPOLI, ITALY
                </option>

                <option value="NARVIK,BOGEN BAY, BOGEN NORWAY">
                  NARVIK,BOGEN BAY, BOGEN NORWAY
                </option>

                <option value="NASSAU, NEW PROV.ISL, BA">
                  NASSAU, NEW PROV.ISL, BA
                </option>

                <option value="NATAL, BRAZ.">NATAL, BRAZ.</option>

                <option value="NAURU ISLAND">NAURU ISLAND</option>

                <option value="NAVEGANTES PORT">NAVEGANTES PORT</option>

                <option value="NAVEGANTES, BRAZIL">NAVEGANTES, BRAZIL</option>

                <option value="NEATH, WALES">NEATH, WALES</option>

                <option value="NECOCHEA, ARGENTINA">NECOCHEA, ARGENTINA</option>

                <option value="NELSON, NEW ZEALAND">NELSON, NEW ZEALAND</option>

                <option value="NEMRUT BAY; ALIAGA TURKEY">
                  NEMRUT BAY; ALIAGA TURKEY
                </option>

                <option value="NESKAUPSTADUR, ICELAND">
                  NESKAUPSTADUR, ICELAND
                </option>

                <option value="NEW AMSTERDAM, GUYANA">
                  NEW AMSTERDAM, GUYANA
                </option>

                <option value="NEW MANGALORE;MANGALORE, INDIA">
                  NEW MANGALORE;MANGALORE, INDIA
                </option>

                <option value="NEW PLYMOUTH NEW ZEALAND">
                  NEW PLYMOUTH NEW ZEALAND
                </option>

                <option value="NEWCASTLE ON TYNE, ENGLAND">
                  NEWCASTLE ON TYNE, ENGLAND
                </option>

                <option value="NEWCASTLE, AUS.">NEWCASTLE, AUS.</option>

                <option value="NEWHAVEN, ENGLAND">NEWHAVEN, ENGLAND</option>

                <option value="NEWPORT, ENGLAND">NEWPORT, ENGLAND</option>

                <option value="NEWPORT, WALES">NEWPORT, WALES</option>

                <option value="NHA TRANG, VIETNAM">NHA TRANG, VIETNAM</option>

                <option value="NHAVA SHEVA">NHAVA SHEVA</option>

                <option value="NHAVA SHEVA JNPT PORT INDIA">
                  NHAVA SHEVA JNPT PORT INDIA
                </option>

                <option value="NHAVA SHEVA PORT">NHAVA SHEVA PORT</option>

                <option value="NHAVA SHEVA PORT IN INDIA">
                  NHAVA SHEVA PORT IN INDIA
                </option>

                <option value="NHAVA SHEVA PORT,INDIA">
                  NHAVA SHEVA PORT,INDIA
                </option>

                <option value="NHAVA SHEVA SEA PORT">
                  NHAVA SHEVA SEA PORT
                </option>

                <option value="NHAVA SHEVA SEAPORT, INDIA">
                  NHAVA SHEVA SEAPORT, INDIA
                </option>

                <option value="NHAVA SHEVA, INDIA">NHAVA SHEVA, INDIA</option>

                <option value="NICE, FRANCE">NICE, FRANCE</option>

                <option value="NIGG BAY UNITED KINGDOM">
                  NIGG BAY UNITED KINGDOM
                </option>

                <option value="NING BO/NINGPO, CHINA M">
                  NING BO/NINGPO, CHINA M
                </option>

                <option value="NINGBO">NINGBO</option>

                <option value="NINGBO, CHINA">NINGBO, CHINA</option>

                <option value="NIUE ISLAND">NIUE ISLAND</option>

                <option value="NJARDVIK, ICELAND">NJARDVIK, ICELAND</option>

                <option value="NORDENHAM, FR GERMANY">
                  NORDENHAM, FR GERMANY
                </option>

                <option value="NORRESUNDBY, DENMARK">
                  NORRESUNDBY, DENMARK
                </option>

                <option value="NORRKOPING, SWEDEN">NORRKOPING, SWEDEN</option>

                <option value="NORRSUNDET, SWEDEN">NORRSUNDET, SWEDEN</option>

                <option value="NOUMEA, NEW CALEDONIA">
                  NOUMEA, NEW CALEDONIA
                </option>

                <option value="NOVIGRAD, CROATIA">NOVIGRAD, CROATIA</option>

                <option value="NSICT,INDIA">NSICT,INDIA</option>

                <option value="NUEVA PALMIRA, URUGUAY">
                  NUEVA PALMIRA, URUGUAY
                </option>

                <option value="NUEVO LAREDO, MEX.">NUEVO LAREDO, MEX.</option>

                <option value="NYBORG, DENMARK">NYBORG, DENMARK</option>

                <option value="NYKOBING, DENMARK">NYKOBING, DENMARK</option>

                <option value="OAKHAM NESS, ENGLAND">
                  OAKHAM NESS, ENGLAND
                </option>

                <option value="OBBOLA, SWEDEN">OBBOLA, SWEDEN</option>

                <option value="OBIDOS, BRAZIL">OBIDOS, BRAZIL</option>

                <option value="OBRAVAC, CROATIA">OBRAVAC, CROATIA</option>

                <option value="OCEAN CAY">OCEAN CAY</option>

                <option value="OCHO RIOS, JAM.">OCHO RIOS, JAM.</option>

                <option value="ODENSE, DENMARK">ODENSE, DENMARK</option>

                <option value="OGUENDJO TERMINAL, GABON">
                  OGUENDJO TERMINAL, GABON
                </option>

                <option value="OISTINO, BARBADOS">OISTINO, BARBADOS</option>

                <option value="OKPO, KOREA">OKPO, KOREA</option>

                <option value="ORAN; WAHRAN, ALGERIA">
                  ORAN; WAHRAN, ALGERIA
                </option>

                <option value="ORANGESTAD;PAARDEN BAY,ARUBA I">
                  ORANGESTAD;PAARDEN BAY,ARUBA I
                </option>

                <option value="ORANJESTAD, ARUBA ">ORANJESTAD, ARUBA </option>

                <option value="ORNSKOLDSVIK, SWEDEN">
                  ORNSKOLDSVIK, SWEDEN
                </option>

                <option value="OSKARSHAMN, SWEDEN">OSKARSHAMN, SWEDEN</option>

                <option value="OSLO, NORWAY">OSLO, NORWAY</option>

                <option value="OSLO; LYSAKER, NORWAY">
                  OSLO; LYSAKER, NORWAY
                </option>

                <option value="OSTEND, BELGIUM">OSTEND, BELGIUM</option>

                <option value="OTH HOND W COAST REG PTS">
                  OTH HOND W COAST REG PTS
                </option>

                <option value="OULU/ULEABORG, FINLAND">
                  OULU/ULEABORG, FINLAND
                </option>

                <option value="OWENDO">OWENDO</option>

                <option value="OXELOSUND, SWEDEN">OXELOSUND, SWEDEN</option>

                <option value="PADANG; TELUK BAYUR, SUMATRA">
                  PADANG; TELUK BAYUR, SUMATRA
                </option>

                <option value="PAITA, PERU">PAITA, PERU</option>

                <option value="PAJARITOS, MEX">PAJARITOS, MEX</option>

                <option value="PALAMOS, SPAIN">PALAMOS, SPAIN</option>

                <option value="PALANCA TERMINAL, ANGOLA">
                  PALANCA TERMINAL, ANGOLA
                </option>

                <option value="PALAU (PELEW) ISLANDS">
                  PALAU (PELEW) ISLANDS
                </option>

                <option value="PALEMBANG, SUMATRA">PALEMBANG, SUMATRA</option>

                <option value="PALERMO, ITALY">PALERMO, ITALY</option>

                <option value="PALUA, VEN.">PALUA, VEN.</option>

                <option value="PANAMA CANAL - CARIBBEAN, COLON, CANAL-CARIB. ">
                  PANAMA CANAL - CARIBBEAN, COLON, CANAL-CARIB.{" "}
                </option>

                <option value="PANAMACTY,PANAMACANAL-PAC PA">
                  PANAMACTY,PANAMACANAL-PAC PA
                </option>

                <option value="PANARUKAN, JAVA">PANARUKAN, JAVA</option>

                <option value="PANDJANG, SUMATRA">PANDJANG, SUMATRA</option>

                <option value="PANGKALAN SUSU, SUMATRA">
                  PANGKALAN SUSU, SUMATRA
                </option>

                <option value="PANGKOL, BANGKA">PANGKOL, BANGKA</option>

                <option value="PANTOLOAN, PALU INDONESIA">
                  PANTOLOAN, PALU INDONESIA
                </option>

                <option value="PARADIP, INDIA">PARADIP, INDIA</option>

                <option value="PARAMARIBO">PARAMARIBO</option>

                <option value="PARAMARIBO;SMALKALDEN,SURINAME">
                  PARAMARIBO;SMALKALDEN,SURINAME
                </option>

                <option value="PARANAGUA">PARANAGUA</option>

                <option value="PARANAGUA, BRAZIL">PARANAGUA, BRAZIL</option>

                <option value="PARANAGUA;ANTONINA, BRAZIL">
                  PARANAGUA;ANTONINA, BRAZIL
                </option>

                <option value="PARANAM, SURINAME">PARANAM, SURINAME</option>

                <option value="PARNAIBA, BRAZ.">PARNAIBA, BRAZ.</option>

                <option value="PASAGES; PASAJES, SPAIN">
                  PASAGES; PASAJES, SPAIN
                </option>

                <option value="PASIR GUDANG">PASIR GUDANG</option>

                <option value="PASIR GUDANG, JOHOR, MALAYSIA">
                  PASIR GUDANG, JOHOR, MALAYSIA
                </option>

                <option value="PASIR GUDANG, MALAYSIA">
                  PASIR GUDANG, MALAYSIA
                </option>

                <option value="PATILLOS;CALETA PATILLOS,CHILE">
                  PATILLOS;CALETA PATILLOS,CHILE
                </option>

                <option value="PATRAI; PATRAS, GREECE">
                  PATRAI; PATRAS, GREECE
                </option>

                <option value="PAUILLAC, FRANCE">PAUILLAC, FRANCE</option>

                <option value="PECEM">PECEM</option>

                <option value="PECEM, BRAZIL">PECEM, BRAZIL</option>

                <option value="PECEM,POCERN, PRT DO PECERCN, BRAZ.">
                  PECEM,POCERN, PRT DO PECERCN, BRAZ.
                </option>

                <option value="PEDREGAL, PAN.">PEDREGAL, PAN.</option>

                <option value="PEMBROKE, WALES">PEMBROKE, WALES</option>

                <option value="PENANG">PENANG</option>

                <option value="PENANG, MALAYSIA">PENANG, MALAYSIA</option>

                <option value="PENANG; PINANG, MALAYSIA">
                  PENANG; PINANG, MALAYSIA
                </option>

                <option value="PENCO">PENCO</option>

                <option value="PENNINGTON, NIGERIA">PENNINGTON, NIGERIA</option>

                <option value="PENRHYN ATOLL, COOK IS.">
                  PENRHYN ATOLL, COOK IS.
                </option>

                <option value="PERNIS, NETHERLANDS">PERNIS, NETHERLANDS</option>

                <option value="PERTH, AUS.">PERTH, AUS.</option>

                <option value="PERTIGALETE, VENEZUELA">
                  PERTIGALETE, VENEZUELA
                </option>

                <option value="PETERHEAD, UNITED KINGDOM">
                  PETERHEAD, UNITED KINGDOM
                </option>

                <option value="PETIT GOAVE, HAITI">PETIT GOAVE, HAITI</option>

                <option value="PHILIPSBURGH/PHILIPSBOROUGH,NA">
                  PHILIPSBURGH/PHILIPSBOROUGH,NA
                </option>

                <option value="PHUKET; BAN THA RUA, THAILAND">
                  PHUKET; BAN THA RUA, THAILAND
                </option>

                <option value="PILOS; PYLOS, GREECE">
                  PILOS; PYLOS, GREECE
                </option>

                <option value="PIMENTEL, PERU">PIMENTEL, PERU</option>

                <option value="PIOMBINO, ITALY">PIOMBINO, ITALY</option>

                <option value="PIPAVAV PORT, INDIA ">
                  PIPAVAV PORT, INDIA{" "}
                </option>

                <option value="PIPAVAV, INDIA">PIPAVAV, INDIA</option>

                <option value="PIRAEUS">PIRAEUS</option>

                <option value="PIRAIEUS; PIRAEUS, GREECE">
                  PIRAIEUS; PIRAEUS, GREECE
                </option>

                <option value="PIRAN; PIRANO, SLOVENIA">
                  PIRAN; PIRANO, SLOVENIA
                </option>

                <option value="PISCO;GENERAL SAN MARTIN, PERU">
                  PISCO;GENERAL SAN MARTIN, PERU
                </option>

                <option value="PLADJU, SUMATRA">PLADJU, SUMATRA</option>

                <option value="PLOCE, CROATIA">PLOCE, CROATIA</option>

                <option value="PLYMOUTH, ENGLAND">PLYMOUTH, ENGLAND</option>

                <option value="PLYMOUTH, MONTSERRAT">
                  PLYMOUTH, MONTSERRAT
                </option>

                <option value="POHANG;POHANG HANG,REP. OF KOR">
                  POHANG;POHANG HANG,REP. OF KOR
                </option>

                <option value="POHNPEI/PONAPE, CAR IS MICRONS">
                  POHNPEI/PONAPE, CAR IS MICRONS
                </option>

                <option value="POINT A PIERRE, TRINIDAD">
                  POINT A PIERRE, TRINIDAD
                </option>

                <option value="POINT FORTIN, TRINIDAD">
                  POINT FORTIN, TRINIDAD
                </option>

                <option value="POINT LISAS, TRINIDAD">
                  POINT LISAS, TRINIDAD
                </option>

                <option value="POINT UBU, BRAZIL">POINT UBU, BRAZIL</option>

                <option value="POINTE A PITRE, GUADELOUPE">
                  POINTE A PITRE, GUADELOUPE
                </option>

                <option value="POINTE DES GALETS, REUNION">
                  POINTE DES GALETS, REUNION
                </option>

                <option value="POLICE, POLAND">POLICE, POLAND</option>

                <option value="PONTA DA MADEIRA, BRAZIL">
                  PONTA DA MADEIRA, BRAZIL
                </option>

                <option value="PONTA DELGADA, AZORES">
                  PONTA DELGADA, AZORES
                </option>

                <option value="PONTIANAK, KALIMANTAN">
                  PONTIANAK, KALIMANTAN
                </option>

                <option value="PORSGRUNN, NORWAY">PORSGRUNN, NORWAY</option>

                <option value="PORT ALMA, AUS.">PORT ALMA, AUS.</option>

                <option value="PORT AU PRINCE, HAITI">
                  PORT AU PRINCE, HAITI
                </option>

                <option value="PORT CAMPHA; CAM PHA, VIET NAM">
                  PORT CAMPHA; CAM PHA, VIET NAM
                </option>

                <option value="PORT CHALMERS, NEW ZEAL">
                  PORT CHALMERS, NEW ZEAL
                </option>

                <option value="PORT DE BOUC; CARONTE, FRANCE">
                  PORT DE BOUC; CARONTE, FRANCE
                </option>

                <option value="PORT DE PAIX, HAITI">PORT DE PAIX, HAITI</option>

                <option value="PORT DICKSON, MALAYSIA">
                  PORT DICKSON, MALAYSIA
                </option>

                <option value="PORT ELIZABETH,REP.S.AFR">
                  PORT ELIZABETH,REP.S.AFR
                </option>

                <option value="PORT ETIENNE, MAURITANIA">
                  PORT ETIENNE, MAURITANIA
                </option>

                <option value="PORT GENTIL, GABON">PORT GENTIL, GABON</option>

                <option value="PORT HARCOURT, NIGERIA">
                  PORT HARCOURT, NIGERIA
                </option>

                <option value="PORT HEDLAND, AUSTRALIA">
                  PORT HEDLAND, AUSTRALIA
                </option>

                <option value="PORT HESS, VI">PORT HESS, VI</option>

                <option value="PORT JEROME, FRANCE">PORT JEROME, FRANCE</option>

                <option value="PORT KAISER, JAM.">PORT KAISER, JAM.</option>

                <option value="PORT KANDLA;KANDLA, INDIA">
                  PORT KANDLA;KANDLA, INDIA
                </option>

                <option value="PORT KELANG, MALAYSIA">
                  PORT KELANG, MALAYSIA
                </option>

                <option value="PORT KEMBLA, AUS.">PORT KEMBLA, AUS.</option>

                <option value="PORT KLANG">PORT KLANG</option>

                <option value="PORT KLANG, MALAYSIA">
                  PORT KLANG, MALAYSIA
                </option>

                <option value="PORT LIMON, COSTA RICA">
                  PORT LIMON, COSTA RICA
                </option>

                <option value="PORT LOUIS, MAURITIUS">
                  PORT LOUIS, MAURITIUS
                </option>

                <option value="PORT LUCAYA, BAHAMAS">
                  PORT LUCAYA, BAHAMAS
                </option>

                <option value="PORT MORESBY, NEW GUINEA">
                  PORT MORESBY, NEW GUINEA
                </option>

                <option value="PORT MUHAMMAD BIN QASIM, PAKIS">
                  PORT MUHAMMAD BIN QASIM, PAKIS
                </option>

                <option value="PORT OF ITAGUAI">PORT OF ITAGUAI</option>

                <option value="PORT OF SHATIAN, CHINA">
                  PORT OF SHATIAN, CHINA
                </option>

                <option value="PORT OF SPAIN">PORT OF SPAIN</option>

                <option value="PORT OF SPAIN, TRINIDAD">
                  PORT OF SPAIN, TRINIDAD
                </option>

                <option value="PORT OF SPAIN, TRINIDAD &amp; TOBAGO ">
                  PORT OF SPAIN, TRINIDAD &amp; TOBAGO{" "}
                </option>

                <option value="PORT PIRIE, AUS.">PORT PIRIE, AUS.</option>

                <option value="PORT QASIM">PORT QASIM</option>

                <option value="PORT RHOADES, JAM.">PORT RHOADES, JAM.</option>

                <option value="PORT SAID">PORT SAID</option>

                <option value="PORT SAID, EGYPT">PORT SAID, EGYPT</option>

                <option value="PORT SAINT LOUIS, FRANCE">
                  PORT SAINT LOUIS, FRANCE
                </option>

                <option value="PORT TALBOT, WALES">PORT TALBOT, WALES</option>

                <option value="PORT VILA, EFATE IS, VANUATU">
                  PORT VILA, EFATE IS, VANUATU
                </option>

                <option value="PORTBURY,  ENGLAND">PORTBURY, ENGLAND</option>

                <option value="PORTLAND, AUSTRAL">PORTLAND, AUSTRAL</option>

                <option value="PORTO ALEGRE;SANTA CLARA, BRAZ">
                  PORTO ALEGRE;SANTA CLARA, BRAZ
                </option>

                <option value="PORTO EMPEDOCLE, ITALY">
                  PORTO EMPEDOCLE, ITALY
                </option>

                <option value="PORTO TORRES, ITALY">PORTO TORRES, ITALY</option>

                <option value="PORTO VESME;PORTOCUSO, ITALY">
                  PORTO VESME;PORTOCUSO, ITALY
                </option>

                <option value="PORTO; OPORTO, PORTUGAL">
                  PORTO; OPORTO, PORTUGAL
                </option>

                <option value="PORTOBELO, PAN.">PORTOBELO, PAN.</option>

                <option value="PORTSMOUTH, DOMINICA ISLAND">
                  PORTSMOUTH, DOMINICA ISLAND
                </option>

                <option value="POTI, GEORGIA">POTI, GEORGIA</option>

                <option value="PRAIA/PRAIA DE VITORIA, AZORES">
                  PRAIA/PRAIA DE VITORIA, AZORES
                </option>

                <option value="PRAIA; PORTO PRAIA, CAPE VERDE">
                  PRAIA; PORTO PRAIA, CAPE VERDE
                </option>

                <option value="PRESTON, ENGLAND">PRESTON, ENGLAND</option>

                <option value="PRIOLO, ITALY">PRIOLO, ITALY</option>

                <option value="PROGRESO, MEX.">PROGRESO, MEX.</option>

                <option value="PROVIDENCIALES, TURKS CAICOS I">
                  PROVIDENCIALES, TURKS CAICOS I
                </option>

                <option value="PSACHNA, GREECE">PSACHNA, GREECE</option>

                <option value="PTP PORT, MALAYSIA ">PTP PORT, MALAYSIA </option>

                <option value="PUERTO ARMUELLES, PAN.">
                  PUERTO ARMUELLES, PAN.
                </option>

                <option value="PUERTO BARRIOS,GUATEMALA">
                  PUERTO BARRIOS,GUATEMALA
                </option>

                <option value="PUERTO BOLIVAR, COLOMB">
                  PUERTO BOLIVAR, COLOMB
                </option>

                <option value="PUERTO BOLIVAR, ECU.">
                  PUERTO BOLIVAR, ECU.
                </option>

                <option value="PUERTO CABELLO, VEN.">
                  PUERTO CABELLO, VEN.
                </option>

                <option value="PUERTO CABEZAS, NICAR.">
                  PUERTO CABEZAS, NICAR.
                </option>

                <option value="PUERTO CASTILLA, HOND.">
                  PUERTO CASTILLA, HOND.
                </option>

                <option value="PUERTO COLOMBIA, COL.">
                  PUERTO COLOMBIA, COL.
                </option>

                <option value="PUERTO CORTES, HOND.">
                  PUERTO CORTES, HOND.
                </option>

                <option value="PUERTO CORTES, HONDURAS HN">
                  PUERTO CORTES, HONDURAS HN
                </option>

                <option value="PUERTO DESEADO, ARGENT">
                  PUERTO DESEADO, ARGENT
                </option>

                <option value="PUERTO HENECAN, HOND.">
                  PUERTO HENECAN, HOND.
                </option>

                <option value="PUERTO LA CRUZ, VENEZ">
                  PUERTO LA CRUZ, VENEZ
                </option>

                <option value="PUERTO LIMON">PUERTO LIMON</option>

                <option value="PUERTO LIMON, COSTA RICA">
                  PUERTO LIMON, COSTA RICA
                </option>

                <option value="PUERTO MADRYN, ARGENT">
                  PUERTO MADRYN, ARGENT
                </option>

                <option value="PUERTO MEXICO, MEX.">PUERTO MEXICO, MEX.</option>

                <option value="PUERTO MIRANDA, VEN.">
                  PUERTO MIRANDA, VEN.
                </option>

                <option value="PUERTO MORALES, MEX.">
                  PUERTO MORALES, MEX.
                </option>

                <option value="PUERTO NUEVO, ECU.">PUERTO NUEVO, ECU.</option>

                <option value="PUERTO ORDAZ, VEN.">PUERTO ORDAZ, VEN.</option>

                <option value="PUERTO PLATA, DOM. REP.">
                  PUERTO PLATA, DOM. REP.
                </option>

                <option value="PUERTO QUETZAL, GUATEMALA">
                  PUERTO QUETZAL, GUATEMALA
                </option>

                <option value="PUERTO SUCRE,CUMANA, VEN">
                  PUERTO SUCRE,CUMANA, VEN
                </option>

                <option value="PUERTO VALLARTA, MEX">
                  PUERTO VALLARTA, MEX
                </option>

                <option value="PULA, POLA, CROATIA">PULA, POLA, CROATIA</option>

                <option value="PULAU SAMBU, RIOW ISLANDS">
                  PULAU SAMBU, RIOW ISLANDS
                </option>

                <option value="PULUM BUKUM, SINGAPORE">
                  PULUM BUKUM, SINGAPORE
                </option>

                <option value="PULUPANDAN, PHILIPPINES">
                  PULUPANDAN, PHILIPPINES
                </option>

                <option value="PUNTA ARENAS, CHILE">PUNTA ARENAS, CHILE</option>

                <option value="PUNTA CARDON, VEN.">PUNTA CARDON, VEN.</option>

                <option value="PUNTA CUCHILLO, VENEZUELA">
                  PUNTA CUCHILLO, VENEZUELA
                </option>

                <option value="PUNTA DEL ESTE, URUGUAY">
                  PUNTA DEL ESTE, URUGUAY
                </option>

                <option value="PUNTA MORALES, COSTA RICA">
                  PUNTA MORALES, COSTA RICA
                </option>

                <option value="PUNTA PALMAS, VENEZUELA">
                  PUNTA PALMAS, VENEZUELA
                </option>

                <option value="PUNTA QUEPOS, COSTA RICA">
                  PUNTA QUEPOS, COSTA RICA
                </option>

                <option value="PUNTARENAS, COSTA RICA">
                  PUNTARENAS, COSTA RICA
                </option>

                <option value="PURTO LIMON, COSTA RICA">
                  PURTO LIMON, COSTA RICA
                </option>

                <option value="PUSAN ">PUSAN </option>

                <option value="PUSAN; BUSAN, REP. OF KOREA">
                  PUSAN; BUSAN, REP. OF KOREA
                </option>

                <option value="PYONGTAEK, PYUNGTAEK S. KOREA">
                  PYONGTAEK, PYUNGTAEK S. KOREA
                </option>

                <option value="QALHAT, OMAN">QALHAT, OMAN</option>

                <option value="QINGDAO">QINGDAO</option>

                <option value="QINGDAO CHINA">QINGDAO CHINA</option>

                <option value="QINGDAO PORT">QINGDAO PORT</option>

                <option value="QINGDAO PORT,CHINA">QINGDAO PORT,CHINA</option>

                <option value="QINGDAO SEAPORT">QINGDAO SEAPORT</option>

                <option value="QINGDAO, CHINA">QINGDAO, CHINA</option>

                <option value="QINGDAO,CHINA">QINGDAO,CHINA</option>

                <option value="QINZHOU, CHINA">QINZHOU, CHINA</option>

                <option value="QUINGDAO, CHINA: TSINGTAO">
                  QUINGDAO, CHINA: TSINGTAO
                </option>

                <option value="QUINTERO, CHILE">QUINTERO, CHILE</option>

                <option value="QUY NHON, VIETNAM">QUY NHON, VIETNAM</option>

                <option value="RAAHE, FINLAND">RAAHE, FINLAND</option>

                <option value="RABAUL, NEW GUINEA">RABAUL, NEW GUINEA</option>

                <option value="RADICATEL, FRANCE">RADICATEL, FRANCE</option>

                <option value="RAGGED ISL,DUNCAN TOWN BAHAMAS">
                  RAGGED ISL,DUNCAN TOWN BAHAMAS
                </option>

                <option value="RAMA,ARLEN SIU, NICARAGUA">
                  RAMA,ARLEN SIU, NICARAGUA
                </option>

                <option value="RANDERS, DENMARK">RANDERS, DENMARK</option>

                <option value="RAS AT TANNURAH,SAUD AR.">
                  RAS AT TANNURAH,SAUD AR.
                </option>

                <option value="RAS GHARIB">RAS GHARIB</option>

                <option value="RAS LAFFAN, QATAR">RAS LAFFAN, QATAR</option>

                <option value="RAS SHUKHEIR, EGYPT">RAS SHUKHEIR, EGYPT</option>

                <option value="RAS SUDR, EGYPT">RAS SUDR, EGYPT</option>

                <option value="RAUMA, FINLAND">RAUMA, FINLAND</option>

                <option value="RAVENNA">RAVENNA</option>

                <option value="RAVENNA ITALIAN PORT">
                  RAVENNA ITALIAN PORT
                </option>

                <option value="RAVENNA SEAPORT IN ITALY ">
                  RAVENNA SEAPORT IN ITALY{" "}
                </option>

                <option value="RAVENNA, ITALY ">RAVENNA, ITALY </option>

                <option value="RAVENNA; PORTO CORSINI, ITALY">
                  RAVENNA; PORTO CORSINI, ITALY
                </option>

                <option value="RAYONG, MAP TA PHUT THAILAND">
                  RAYONG, MAP TA PHUT THAILAND
                </option>

                <option value="RECIFE; PERNAMBUCO, BRAZIL">
                  RECIFE; PERNAMBUCO, BRAZIL
                </option>

                <option value="REDCAR,  ENGLAND">REDCAR, ENGLAND</option>

                <option value="REKEFJORD, NORWAY">REKEFJORD, NORWAY</option>

                <option value="REY MALABO; SANTA ISABEL,EQ GU">
                  REY MALABO; SANTA ISABEL,EQ GU
                </option>

                <option value="REYKJAVIK, ICEL.">REYKJAVIK, ICEL.</option>

                <option value="RICHARDS BAY, REP SAF">
                  RICHARDS BAY, REP SAF
                </option>

                <option value="RIGA, LATVIA">RIGA, LATVIA</option>

                <option value="RIJEKA PORT">RIJEKA PORT</option>

                <option value="RIJEKA, CROATIA">RIJEKA, CROATIA</option>

                <option value="RIJEKA, FIUME, BAKAR, CROATIA">
                  RIJEKA, FIUME, BAKAR, CROATIA
                </option>

                <option value="RIO DE GRANDE, BRAZIL">
                  RIO DE GRANDE, BRAZIL
                </option>

                <option value="RIO DE JANEIRO">RIO DE JANEIRO</option>

                <option value="RIO DE JANEIRO, BRAZIL">
                  RIO DE JANEIRO, BRAZIL
                </option>

                <option value="RIO DE JANEIRO; NITEROI, BRAZ.">
                  RIO DE JANEIRO; NITEROI, BRAZ.
                </option>

                <option value="RIO GRANDE PORT">RIO GRANDE PORT</option>

                <option value="RIO GRANDE, BRAZIL">RIO GRANDE, BRAZIL</option>

                <option value="RIO HAINA">RIO HAINA</option>

                <option value="RIO JAINA, RIO HAINA, JAINA, HAINA, DOM REP">
                  RIO JAINA, RIO HAINA, JAINA, HAINA, DOM REP
                </option>

                <option value="RIZHAO, CHINA MAINLAND">
                  RIZHAO, CHINA MAINLAND
                </option>

                <option value="ROATAN, HOND.">ROATAN, HOND.</option>

                <option value="ROCHEFORT, FRANCE">ROCHEFORT, FRANCE</option>

                <option value="ROCKY POINT, JAM.">ROCKY POINT, JAM.</option>

                <option value="RODMAN, PANAMA">RODMAN, PANAMA</option>

                <option value="RONNE, DENMARK">RONNE, DENMARK</option>

                <option value="RONNSKER,  SWEDEN">RONNSKER, SWEDEN</option>

                <option value="ROSARIO, ARG.">ROSARIO, ARG.</option>

                <option value="ROSARITO, MEX.">ROSARITO, MEX.</option>

                <option value="ROSEAU, DOMINICA ISLAND">
                  ROSEAU, DOMINICA ISLAND
                </option>

                <option value="ROSTOCK, FR GERMANY">ROSTOCK, FR GERMANY</option>

                <option value="ROTTERDAM">ROTTERDAM</option>

                <option value="ROTTERDAM PORT">ROTTERDAM PORT</option>

                <option value="ROTTERDAM PORT, NETHERLANDS">
                  ROTTERDAM PORT, NETHERLANDS
                </option>

                <option value="ROTTERDAM, EUROPEAN SEAPORT ">
                  ROTTERDAM, EUROPEAN SEAPORT{" "}
                </option>

                <option value="ROTTERDAM, NETHERLANDS">
                  ROTTERDAM, NETHERLANDS
                </option>

                <option value="ROTTERDAM,EUROPEAN UNION PORT">
                  ROTTERDAM,EUROPEAN UNION PORT
                </option>

                <option value="ROUEN, FRANCE">ROUEN, FRANCE</option>

                <option value="RUM CAY,PORT NELSON BAHAMAS">
                  RUM CAY,PORT NELSON BAHAMAS
                </option>

                <option value="S ATLANTIC TNKR TRANS PT">
                  S ATLANTIC TNKR TRANS PT
                </option>

                <option value="S. PACIFIC TNKR TRANS PT">
                  S. PACIFIC TNKR TRANS PT
                </option>

                <option value="SAFAGA, EGYPT">SAFAGA, EGYPT</option>

                <option value="SAFFI, SAFI, MOROCCO">
                  SAFFI, SAFI, MOROCCO
                </option>

                <option value="SAGUNTO; PUERTO DE SAGUNTO, SP">
                  SAGUNTO; PUERTO DE SAGUNTO, SP
                </option>

                <option value="SAIMAA CANAL, FINLAND">
                  SAIMAA CANAL, FINLAND
                </option>

                <option value="SAINT DENIS, REUNION">
                  SAINT DENIS, REUNION
                </option>

                <option value="SAINT GEORGES, BERMUDA">
                  SAINT GEORGES, BERMUDA
                </option>

                <option value="SAINT MARC, HAITI">SAINT MARC, HAITI</option>

                <option value="SAINT NAZAIRE, FRANCE">
                  SAINT NAZAIRE, FRANCE
                </option>

                <option value="SAIPAN, N MAR I">SAIPAN, N MAR I</option>

                <option value="SALALAH; MINA RAYSUT, OMAN">
                  SALALAH; MINA RAYSUT, OMAN
                </option>

                <option value="SALAVERRY, PERU">SALAVERRY, PERU</option>

                <option value="SALERNO PORT, ITALY ">
                  SALERNO PORT, ITALY{" "}
                </option>

                <option value="SALERNO, ITALY">SALERNO, ITALY</option>

                <option value="SALINA CRUZ, MEX.">SALINA CRUZ, MEX.</option>

                <option value="SALINAS, ECUADOR">SALINAS, ECUADOR</option>

                <option value="SALTEN,  NORWAY">SALTEN, NORWAY</option>

                <option value="SALVADOR, BRAZIL">SALVADOR, BRAZIL</option>

                <option value="SAMANA,SANTA BARB.DE SAMANA DR">
                  SAMANA,SANTA BARB.DE SAMANA DR
                </option>

                <option value="SAMARINDA, INDONESIA">
                  SAMARINDA, INDONESIA
                </option>

                <option value="SAMIL/YEOSU/YOSU, KOR REP">
                  SAMIL/YEOSU/YOSU, KOR REP
                </option>

                <option value="SAMOS, GREECE">SAMOS, GREECE</option>

                <option value="SAMSUN, TURKEY">SAMSUN, TURKEY</option>

                <option value="SAN ANDRES, COLOMB">SAN ANDRES, COLOMB</option>

                <option value="SAN ANTONIO">SAN ANTONIO</option>

                <option value="SAN ANTONIO, CHILE">SAN ANTONIO, CHILE</option>

                <option value="SAN CIPRIAN, SPAIN">SAN CIPRIAN, SPAIN</option>

                <option value="SAN FELIU DE GUIXOLS, SPAIN">
                  SAN FELIU DE GUIXOLS, SPAIN
                </option>

                <option value="SAN FELIX, VEN.">SAN FELIX, VEN.</option>

                <option value="SAN FERNANDO, PHILIPPINES">
                  SAN FERNANDO, PHILIPPINES
                </option>

                <option value="SAN FERNANDO, TRINIDAD">
                  SAN FERNANDO, TRINIDAD
                </option>

                <option value="SAN JOSE, COSTA RICA">
                  SAN JOSE, COSTA RICA
                </option>

                <option value="SAN JOSE, GUATEMALA">SAN JOSE, GUATEMALA</option>

                <option value="SAN LORENZO, ARG.">SAN LORENZO, ARG.</option>

                <option value="SAN MARCOS,MARTIN,IS,MEX">
                  SAN MARCOS,MARTIN,IS,MEX
                </option>

                <option value="SAN MART, PUERTO DRUMMOND,COL.">
                  SAN MART, PUERTO DRUMMOND,COL.
                </option>

                <option value="SAN NICOLAS BAY, ARUBA ISLAND">
                  SAN NICOLAS BAY, ARUBA ISLAND
                </option>

                <option value="SAN NICOLAS, ARG.">SAN NICOLAS, ARG.</option>

                <option value="SAN NICOLAS, PERU">SAN NICOLAS, PERU</option>

                <option value="SAN PEDRO D MACORIS,D.R.">
                  SAN PEDRO D MACORIS,D.R.
                </option>

                <option value="SAN PEDRO, ARG.">SAN PEDRO, ARG.</option>

                <option value="SAN PEDRO, IVORY COAST">
                  SAN PEDRO, IVORY COAST
                </option>

                <option value="SAN T OU">SAN T OU</option>

                <option value="SAN VICENTE, CHILE">SAN VICENTE, CHILE</option>

                <option value="SANDAKAN, MALAYSA">SANDAKAN, MALAYSA</option>

                <option value="SANDARNE, SWEDEN">SANDARNE, SWEDEN</option>

                <option value="SANDNES,  NORWAY">SANDNES, NORWAY</option>

                <option value="SANTA CRUZ DE LA PALMA">
                  SANTA CRUZ DE LA PALMA
                </option>

                <option value="SANTA CRUZ DE TENERIFE ">
                  SANTA CRUZ DE TENERIFE{" "}
                </option>

                <option value="SANTA CRUZ, PHILIPPINES">
                  SANTA CRUZ, PHILIPPINES
                </option>

                <option value="SANTA FE, ARG.">SANTA FE, ARG.</option>

                <option value="SANTA PANAGIA, ITALY">
                  SANTA PANAGIA, ITALY
                </option>

                <option value="SANTA ROSALIA, MEX.">SANTA ROSALIA, MEX.</option>

                <option value="SANTAN TERMINAL, KALIMANTAN">
                  SANTAN TERMINAL, KALIMANTAN
                </option>

                <option value="SANTANDER, SPAIN">SANTANDER, SPAIN</option>

                <option value="SANTIAGO, CHILE">SANTIAGO, CHILE</option>

                <option value="SANTO DOMINGO, DOM. REP.">
                  SANTO DOMINGO, DOM. REP.
                </option>

                <option value="SANTO TOMAS, GUATEMALA">
                  SANTO TOMAS, GUATEMALA
                </option>

                <option value="SANTO/PALIKULO, VANUATU">
                  SANTO/PALIKULO, VANUATU
                </option>

                <option value="SANTOS">SANTOS</option>

                <option value="SANTOS PORT, BRAZIL">SANTOS PORT, BRAZIL</option>

                <option value="SANTOS, BRASIL">SANTOS, BRASIL</option>

                <option value="SANTOS, BRAZ.">SANTOS, BRAZ.</option>

                <option value="SANTOS, BRAZIL">SANTOS, BRAZIL</option>

                <option value="SANTOS-SP-BRASIL">SANTOS-SP-BRASIL</option>

                <option value="SANTOS-SP/BRASIL">SANTOS-SP/BRASIL</option>

                <option value="SAO FRANCISCO DO SUL, BRAZIL">
                  SAO FRANCISCO DO SUL, BRAZIL
                </option>

                <option value="SAO SEBASTIAO, BRAZ.">
                  SAO SEBASTIAO, BRAZ.
                </option>

                <option value="SAO TOME, SAO TOME AND PRINCIP">
                  SAO TOME, SAO TOME AND PRINCIP
                </option>

                <option value="SAPELE,NIGERIA">SAPELE,NIGERIA</option>

                <option value="SARROCH, ITALY">SARROCH, ITALY</option>

                <option value="SAUDA, NORWAY">SAUDA, NORWAY</option>

                <option value="SAVANNA LA MAR-JAM">SAVANNA LA MAR-JAM</option>

                <option value="SAVONA, ITALY">SAVONA, ITALY</option>

                <option value="SCARBOROUGH, TOBAGO">SCARBOROUGH, TOBAGO</option>

                <option value="SEAFORTH, ENGLAND">SEAFORTH, ENGLAND</option>

                <option value="SEMARANG, JAVA">SEMARANG, JAVA</option>

                <option value="SEME TERMINAL, BENIN">
                  SEME TERMINAL, BENIN
                </option>

                <option value="SENIPAH TERMINAL, KALIMANTAN">
                  SENIPAH TERMINAL, KALIMANTAN
                </option>

                <option value="SEPETIBA">SEPETIBA</option>

                <option value="SERIA, BRUNEI">SERIA, BRUNEI</option>

                <option value="SERIPHOS; SERIFOS, GREECE">
                  SERIPHOS; SERIFOS, GREECE
                </option>

                <option value="SETE, FRANCE">SETE, FRANCE</option>

                <option value="SETUBAL, PORTUGAL">SETUBAL, PORTUGAL</option>

                <option value="SEVILLE; SEVILLA, SPAIN">
                  SEVILLE; SEVILLA, SPAIN
                </option>

                <option value="SFAX, TUNISIA">SFAX, TUNISIA</option>

                <option value="SHANGHAI">SHANGHAI</option>

                <option value="SHANGHAI PORT">SHANGHAI PORT</option>

                <option value="SHANGHAI SEAPORT CHINA">
                  SHANGHAI SEAPORT CHINA
                </option>

                <option value="SHANGHAI, CHINA">SHANGHAI, CHINA</option>

                <option value="SHARJAH; MINA KHALID, ARAB EM.">
                  SHARJAH; MINA KHALID, ARAB EM.
                </option>

                <option value="SHEERNESS;RIDHAM DOCK, ENGLAND">
                  SHEERNESS;RIDHAM DOCK, ENGLAND
                </option>

                <option value="SHEKOU">SHEKOU</option>

                <option value="SHEKOU, CHINA">SHEKOU, CHINA</option>

                <option value="SHELLHAVEN, ENGLAND">SHELLHAVEN, ENGLAND</option>

                <option value="SHENZHEN">SHENZHEN</option>

                <option value="SHENZHEN, CHINA">SHENZHEN, CHINA</option>

                <option value="SHUAIBA; ASH SHUAIBA, KUWAIT">
                  SHUAIBA; ASH SHUAIBA, KUWAIT
                </option>

                <option value="SHUWAIKH, KUWAIT">SHUWAIKH, KUWAIT</option>

                <option value="SIBENIK; SIBVENICO, CROATIA">
                  SIBENIK; SIBVENICO, CROATIA
                </option>

                <option value="SIBUCO BAY, KALIMANTAN">
                  SIBUCO BAY, KALIMANTAN
                </option>

                <option value="SIDI KERIR, EGYPT">SIDI KERIR, EGYPT</option>

                <option value="SIHANOUKVILLE, CAMBODIA">
                  SIHANOUKVILLE, CAMBODIA
                </option>

                <option value="SINES, PORTUGAL">SINES, PORTUGAL</option>

                <option value="SINGAPORE">SINGAPORE</option>

                <option value="SINGAPORE, SINGAPORE">
                  SINGAPORE, SINGAPORE
                </option>

                <option value="SKARAMANGA, GREECE">SKARAMANGA, GREECE</option>

                <option value="SKELLEFTEA, SWEDEN">SKELLEFTEA, SWEDEN</option>

                <option value="SKIEN,  NORWAY">SKIEN, NORWAY</option>

                <option value="SKIKDA, ALGERIA">SKIKDA, ALGERIA</option>

                <option value="SKOLDVIK, PORVOO, FINLAND">
                  SKOLDVIK, PORVOO, FINLAND
                </option>

                <option value="SLUISKIL, NETHERLANDS">
                  SLUISKIL, NETHERLANDS
                </option>

                <option value="SODERHAMN, SWEDEN">SODERHAMN, SWEDEN</option>

                <option value="SOHAR">SOHAR</option>

                <option value="SOHAR , OMAN">SOHAR , OMAN</option>

                <option value="SOHAR, OMAN">SOHAR, OMAN</option>

                <option value="SOKHANA, EGYPT ">SOKHANA, EGYPT </option>

                <option value="SOKHNA, EGYPT ">SOKHNA, EGYPT </option>

                <option value="SOMBRERO ISLAND, LEEWARD ISLDS">
                  SOMBRERO ISLAND, LEEWARD ISLDS
                </option>

                <option value="SONGKHLA, THAILAND">SONGKHLA, THAILAND</option>

                <option value="SOUDHA,SOUDA BAY, GREECE">
                  SOUDHA,SOUDA BAY, GREECE
                </option>

                <option value="SOUSSE, TUNISIA ">SOUSSE, TUNISIA </option>

                <option value="SOUTH HARBOR, MANILA, PHILIPPINES">
                  SOUTH HARBOR, MANILA, PHILIPPINES
                </option>

                <option value="SOUTHAMPTON">SOUTHAMPTON</option>

                <option value="SOUTHAMPTON, U.K ">SOUTHAMPTON, U.K </option>

                <option value="SOUTHAMPTON, UNITED KINGDOM">
                  SOUTHAMPTON, UNITED KINGDOM
                </option>

                <option value="SOUTHAMPTON; HAMBLE, ENGLAND">
                  SOUTHAMPTON; HAMBLE, ENGLAND
                </option>

                <option value="SOYO-OIL/QUINFUGUENA TER,ANGOL">
                  SOYO-OIL/QUINFUGUENA TER,ANGOL
                </option>

                <option value="SPALATO; SOLIN, CROATIA">
                  SPALATO; SOLIN, CROATIA
                </option>

                <option value="SPANISH WELLS, BAHAMAS">
                  SPANISH WELLS, BAHAMAS
                </option>

                <option value="SPEIGHTSTOWN, BARBADOS">
                  SPEIGHTSTOWN, BARBADOS
                </option>

                <option value="SPITSBERGEN/SVALBARD,JAN MAYEN">
                  SPITSBERGEN/SVALBARD,JAN MAYEN
                </option>

                <option value="SPLIT, CROATIA">SPLIT, CROATIA</option>

                <option value="SRIRACHA; SRI RACHA, THAILAND">
                  SRIRACHA; SRI RACHA, THAILAND
                </option>

                <option value="ST. BARTHS/GUSTAVIA, GUADELPE">
                  ST. BARTHS/GUSTAVIA, GUADELPE
                </option>

                <option value="ST. EUSTATIUS, NETHERLANDS ANT">
                  ST. EUSTATIUS, NETHERLANDS ANT
                </option>

                <option value="ST. GEROGE,  GRENADA">
                  ST. GEROGE, GRENADA
                </option>

                <option value="ST. JOHNS, ANTIGUA">ST. JOHNS, ANTIGUA</option>

                <option value="ST. PIERRE, MIQUELON">
                  ST. PIERRE, MIQUELON
                </option>

                <option value="ST.MAART,ST.MART,GALI,NET.ANTI">
                  ST.MAART,ST.MART,GALI,NET.ANTI
                </option>

                <option value="STANN CREEK,DANGRIGA, BELIZE">
                  STANN CREEK,DANGRIGA, BELIZE
                </option>

                <option value="STAVANGER, NORWAY">STAVANGER, NORWAY</option>

                <option value="STENUNGSUND, SWEDEN">STENUNGSUND, SWEDEN</option>

                <option value="STETTIN; SZCZECIN, POLAND">
                  STETTIN; SZCZECIN, POLAND
                </option>

                <option value="STIGNAESVAERKETS/STIGSNAES,DEN">
                  STIGNAESVAERKETS/STIGSNAES,DEN
                </option>

                <option value="STOCKHOLM, SWEDEN">STOCKHOLM, SWEDEN</option>

                <option value="STOCKVIK,  SWEDEN">STOCKVIK, SWEDEN</option>

                <option value="STRUER, DENMARK">STRUER, DENMARK</option>

                <option value="SU AO/SUAO, CHINA T">SU AO/SUAO, CHINA T</option>

                <option value="SUAPE, BRAZ.">SUAPE, BRAZ.</option>

                <option value="SUBIC BAY FREEPORT ZONE ">
                  SUBIC BAY FREEPORT ZONE{" "}
                </option>

                <option value="SUBIC BAY;OLONGAPO, PHILIPPINE">
                  SUBIC BAY;OLONGAPO, PHILIPPINE
                </option>

                <option value="SUEZ">SUEZ</option>

                <option value="SUEZ; ADABIYA, EGYPT">
                  SUEZ; ADABIYA, EGYPT
                </option>

                <option value="SUKARNAPURA, WEST NEW GUINEA">
                  SUKARNAPURA, WEST NEW GUINEA
                </option>

                <option value="SUKHUMI, GEORGIA">SUKHUMI, GEORGIA</option>

                <option value="SULLOM VOE, SCOTLAND">
                  SULLOM VOE, SCOTLAND
                </option>

                <option value="SULTAN QABOOS; MUSCAT, OMAN">
                  SULTAN QABOOS; MUSCAT, OMAN
                </option>

                <option value="SUNDERLAND, ENGLAND">SUNDERLAND, ENGLAND</option>

                <option value="SUNDSVALL, SWEDEN">SUNDSVALL, SWEDEN</option>

                <option value="SUNNDALSORA, NORWAY">SUNNDALSORA, NORWAY</option>

                <option value="SUPE, PERU">SUPE, PERU</option>

                <option value="SUR, OMAN">SUR, OMAN</option>

                <option value="SURABAJA, JAVA">SURABAJA, JAVA</option>

                <option value="SURABAYA">SURABAYA</option>

                <option value="SURABAYA, INDONESIA">SURABAYA, INDONESIA</option>

                <option value="SUVA (SAVU), FIJI ISLS.">
                  SUVA (SAVU), FIJI ISLS.
                </option>

                <option value="SVELGEN,  NORWAY">SVELGEN, NORWAY</option>

                <option value="SVENDBORG, DENMARK">SVENDBORG, DENMARK</option>

                <option value="SWANSEA, WALES">SWANSEA, WALES</option>

                <option value="SWINOUJSCIE, POLAND">SWINOUJSCIE, POLAND</option>

                <option value="SYDNEY">SYDNEY</option>

                <option value="SYDNEY, AUS.">SYDNEY, AUS.</option>

                <option value="SYDNEY, AUSTRALIA">SYDNEY, AUSTRALIA</option>

                <option value="SYROS, GREECE">SYROS, GREECE</option>

                <option value="SZCZECIN">SZCZECIN</option>

                <option value="SZCZECIN, POLAND">SZCZECIN, POLAND</option>

                <option value="TABACO, PHILIPPINES">TABACO, PHILIPPINES</option>

                <option value="TACLOBAN, PHILIPPINES">
                  TACLOBAN, PHILIPPINES
                </option>

                <option value="TAHITI, FR PAC ISL.">TAHITI, FR PAC ISL.</option>

                <option value="TAICHUNG, TAIWAN">TAICHUNG, TAIWAN</option>

                <option value="TAINAN, CHINA (TAIWAN)">
                  TAINAN, CHINA (TAIWAN)
                </option>

                <option value="TAIPEI ">TAIPEI </option>

                <option value="TAIPEI,TAIBEI CHINA TAIWAN">
                  TAIPEI,TAIBEI CHINA TAIWAN
                </option>

                <option value="TAKORADI, GHANA">TAKORADI, GHANA</option>

                <option value="TAKULA TERMINAL, ANGOLA">
                  TAKULA TERMINAL, ANGOLA
                </option>

                <option value="TALARA, PERU">TALARA, PERU</option>

                <option value="TALCAHUANO, CHILE">TALCAHUANO, CHILE</option>

                <option value="TALLINN, ESTONIA">TALLINN, ESTONIA</option>

                <option value="TAMATAVE">TAMATAVE</option>

                <option value="TAMSUI, CHINA (TAIWAN)">
                  TAMSUI, CHINA (TAIWAN)
                </option>

                <option value="TAN CANG, VIETNAM">TAN CANG, VIETNAM</option>

                <option value="TANDOC, PHILIPPINES">TANDOC, PHILIPPINES</option>

                <option value="TANGA, TANZANIA">TANGA, TANZANIA</option>

                <option value="TANGER MED">TANGER MED</option>

                <option value="TANGIER, MOROCCO">TANGIER, MOROCCO</option>

                <option value="TANJIAJING, CHINA M.">
                  TANJIAJING, CHINA M.
                </option>

                <option value="TANJUNG EMAS SEMARANG, INDONESIA">
                  TANJUNG EMAS SEMARANG, INDONESIA
                </option>

                <option value="TANJUNG EMAS SEMARANG,*">
                  TANJUNG EMAS SEMARANG,*
                </option>

                <option value="TANJUNG PELEPAS, MALAYSIA">
                  TANJUNG PELEPAS, MALAYSIA
                </option>

                <option value="TANJUNG PERAK,*">TANJUNG PERAK,*</option>

                <option value="TANJUNG PRIOK PORT,*">
                  TANJUNG PRIOK PORT,*
                </option>

                <option value="TANJUNGPANDAN, BILLITON">
                  TANJUNGPANDAN, BILLITON
                </option>

                <option value="TAORANGA, N ZEAL">TAORANGA, N ZEAL</option>

                <option value="TARAKAN, INDONESIA">TARAKAN, INDONESIA</option>

                <option value="TARANTO, ITALY">TARANTO, ITALY</option>

                <option value="TARBERT;TARBERT ISLAND, IRELAN">
                  TARBERT;TARBERT ISLAND, IRELAN
                </option>

                <option value="TARIFA, SPAIN">TARIFA, SPAIN</option>

                <option value="TARRAGONA, SPAIN">TARRAGONA, SPAIN</option>

                <option value="TAURANGA, NEW ZEALAND">
                  TAURANGA, NEW ZEALAND
                </option>

                <option value="TEESPORT; SEAL SANDS;TEES, ENG">
                  TEESPORT; SEAL SANDS;TEES, ENG
                </option>

                <option value="TEGAL, JAVA">TEGAL, JAVA</option>

                <option value="TEL AVIV YAFO, ISREAL">
                  TEL AVIV YAFO, ISREAL
                </option>

                <option value="TELA, HOND.">TELA, HOND.</option>

                <option value="TEMA (TEMO), GHANA">TEMA (TEMO), GHANA</option>

                <option value="TEMBLADORA, TRINIDAD">
                  TEMBLADORA, TRINIDAD
                </option>

                <option value="TERCEIRA ISLAND, AZORES">
                  TERCEIRA ISLAND, AZORES
                </option>

                <option value="TERNEUZEN, NETHERLANDS">
                  TERNEUZEN, NETHERLANDS
                </option>

                <option value="TG PRIOK JAKARTA*">TG PRIOK JAKARTA*</option>

                <option value="TG. PRIOK JAKARTA *">TG. PRIOK JAKARTA *</option>

                <option value="TG. PRIOK, JAKARTA, *">
                  TG. PRIOK, JAKARTA, *
                </option>

                <option value="TG.PRIOK, INDONESIA">TG.PRIOK, INDONESIA</option>

                <option value="THAMES HAVEN, ENGLAND">
                  THAMES HAVEN, ENGLAND
                </option>

                <option value="THAMESPORT, ENGLAND">THAMESPORT, ENGLAND</option>

                <option value="THE HAGUE, NETHERLANDS">
                  THE HAGUE, NETHERLANDS
                </option>

                <option value="THESSALONIKI">THESSALONIKI</option>

                <option value="THESSALONIKI; SALONIKA, GREECE">
                  THESSALONIKI; SALONIKA, GREECE
                </option>

                <option value="THULE, GREENLAND">THULE, GREENLAND</option>

                <option value="TIANJIN">TIANJIN</option>

                <option value="TIENTSIN; TIANJINXIN GANG, CHN">
                  TIENTSIN; TIANJINXIN GANG, CHN
                </option>

                <option value="TILBURY">TILBURY</option>

                <option value="TILBURY, ENGLAND">TILBURY, ENGLAND</option>

                <option value="TIMARU, NEW ZEALAND">TIMARU, NEW ZEALAND</option>

                <option value="TIMOR, TIMOR ISLAND">TIMOR, TIMOR ISLAND</option>

                <option value="TINCAN -PTML ">TINCAN -PTML </option>

                <option value="TINIAN, N MAR I">TINIAN, N MAR I</option>

                <option value="TJIREBON; CHERIBON, JAVA">
                  TJIREBON; CHERIBON, JAVA
                </option>

                <option value="TOAMASINA; TAMATAVE,MADAGASCAR">
                  TOAMASINA; TAMATAVE,MADAGASCAR
                </option>

                <option value="TOCOPILLA, CHILE">TOCOPILLA, CHILE</option>

                <option value="TOKELAU ISLANDS">TOKELAU ISLANDS</option>

                <option value="TOPOLOBAMPO, MEXICO">TOPOLOBAMPO, MEXICO</option>

                <option value="TOROS GUBRE, TURKEY">TOROS GUBRE, TURKEY</option>

                <option value="TORRECILLA,PUNTA TORRECILLA,DR">
                  TORRECILLA,PUNTA TORRECILLA,DR
                </option>

                <option value="TORREVIEJA, SPAIN">TORREVIEJA, SPAIN</option>

                <option value="TOULON, FRANCE">TOULON, FRANCE</option>

                <option value="TOWNSVILLE, AUS.">TOWNSVILLE, AUS.</option>

                <option value="TRAMANDAI, BRAZIL">TRAMANDAI, BRAZIL</option>

                <option value="TRAPANI">TRAPANI</option>

                <option value="TREASURE CAY, BAHAMAS">
                  TREASURE CAY, BAHAMAS
                </option>

                <option value="TRELLEBORG,  SWEDEN">TRELLEBORG, SWEDEN</option>

                <option value="TRIESTE ITALY PORT">TRIESTE ITALY PORT</option>

                <option value="TRIESTE, ITALY">TRIESTE, ITALY</option>

                <option value="TRINCOMALEE,  SRI LKA">
                  TRINCOMALEE, SRI LKA
                </option>

                <option value="TRIPOLI,LEBANON">TRIPOLI,LEBANON</option>

                <option value="TROMBETAS, BRAZIL">TROMBETAS, BRAZIL</option>

                <option value="TROMSO, NORWAY">TROMSO, NORWAY</option>

                <option value="TRONDHEIM, NORWAY">TRONDHEIM, NORWAY</option>

                <option value="TRUK; CHUUK, TURK ISLANDS">
                  TRUK; CHUUK, TURK ISLANDS
                </option>

                <option value="TSINGTAO, QUINGDAO  CHINA M">
                  TSINGTAO, QUINGDAO CHINA M
                </option>

                <option value="TUBARAO">TUBARAO</option>

                <option value="TUMACO, COLOMBIA">TUMACO, COLOMBIA</option>

                <option value="TUNIS, TUNISIA">TUNIS, TUNISIA</option>

                <option value="TURBO, COL.">TURBO, COL.</option>

                <option value="TURKU; ABO, FINLAND">TURKU; ABO, FINLAND</option>

                <option value="TUTICORIN PORT, INDIA">
                  TUTICORIN PORT, INDIA
                </option>

                <option value="TUTICORIN, INDIA">TUTICORIN, INDIA</option>

                <option value="TUXPAN, MEX.">TUXPAN, MEX.</option>

                <option value="UDDEVALLA, SWEDEN">UDDEVALLA, SWEDEN</option>

                <option value="UKPOKITI, NIGERIA">UKPOKITI, NIGERIA</option>

                <option value="ULSAN, KOR REP">ULSAN, KOR REP</option>

                <option value="UMEA, SWEDEN">UMEA, SWEDEN</option>

                <option value="UMM AL QUWAIN, UAE">UMM AL QUWAIN, UAE</option>

                <option value="UST-DUNAISK, UKRAINE">
                  UST-DUNAISK, UKRAINE
                </option>

                <option value="UTANSJO, SWEDEN">UTANSJO, SWEDEN</option>

                <option value="UUSIKAUPUNKI; NYSTAD, FINLAND">
                  UUSIKAUPUNKI; NYSTAD, FINLAND
                </option>

                <option value="UVOL,MONTAGUHARBOR PAP.NW.GUIN">
                  UVOL,MONTAGUHARBOR PAP.NW.GUIN
                </option>

                <option value="VAASA; VASA, FINLAND">
                  VAASA; VASA, FINLAND
                </option>

                <option value="VADA, ITALY">VADA, ITALY</option>

                <option value="VADO LIGURE, ITALY">VADO LIGURE, ITALY</option>

                <option value="VALENCIA">VALENCIA</option>

                <option value="VALENCIA, SPAIN">VALENCIA, SPAIN</option>

                <option value="VALETTA, MALTA">VALETTA, MALTA</option>

                <option value="VALLVIK, SWEDEN">VALLVIK, SWEDEN</option>

                <option value="VALPARAISO, CHILE">VALPARAISO, CHILE</option>

                <option value="VARNA, BULGARIA">VARNA, BULGARIA</option>

                <option value="VASSILIKO, CYPRUS">VASSILIKO, CYPRUS</option>

                <option value="VASTERAS, SWEDEN">VASTERAS, SWEDEN</option>

                <option value="VASTERVIK, SWEDEN">VASTERVIK, SWEDEN</option>

                <option value="VEILE; VEJLE, DENMARK">
                  VEILE; VEJLE, DENMARK
                </option>

                <option value="VENEZIA">VENEZIA</option>

                <option value="VENICE">VENICE</option>

                <option value="VENICE PORT OF ITALY ">
                  VENICE PORT OF ITALY{" "}
                </option>

                <option value="VENICE, ITALY">VENICE, ITALY</option>

                <option value="VENICE; LIDO, ITALY">VENICE; LIDO, ITALY</option>

                <option value="VENTSPILS; VINDAU; VINDAVA, LV">
                  VENTSPILS; VINDAU; VINDAVA, LV
                </option>

                <option value="VERA CRUZ, MEX.">VERA CRUZ, MEX.</option>

                <option value="VERACRUZ">VERACRUZ</option>

                <option value="VERAVAL, INDIA">VERAVAL, INDIA</option>

                <option value="VESTMANNAEYJAR;WEST.ISLES,ICEL">
                  VESTMANNAEYJAR;WEST.ISLES,ICEL
                </option>

                <option value="VICTORIA, SEYCHELLES">
                  VICTORIA, SEYCHELLES
                </option>

                <option value="VICTORIA; VITORIA, BRAZIL">
                  VICTORIA; VITORIA, BRAZIL
                </option>

                <option value="VIEUX FORT, ST. LUCIA">
                  VIEUX FORT, ST. LUCIA
                </option>

                <option value="VIGO, SPAIN">VIGO, SPAIN</option>

                <option value="VILA DO CONDE">VILA DO CONDE</option>

                <option value="VILLA CONSTITUCION, ARG.">
                  VILLA CONSTITUCION, ARG.
                </option>

                <option value="VISAKHAPATNAM PORT, INDIA">
                  VISAKHAPATNAM PORT, INDIA
                </option>

                <option value="VISHAKHAPATNAM, INDIA">
                  VISHAKHAPATNAM, INDIA
                </option>

                <option value="VITORIA PORT IN BRAZIL">
                  VITORIA PORT IN BRAZIL
                </option>

                <option value="VLAARDINGEN, NETHERLANDS">
                  VLAARDINGEN, NETHERLANDS
                </option>

                <option value="VLISSINGEN; FLUSHING, NETHLDS">
                  VLISSINGEN; FLUSHING, NETHLDS
                </option>

                <option value="VOLOS, GREECE">VOLOS, GREECE</option>

                <option value="VUNG TAU">VUNG TAU</option>

                <option value="WALKER CAY, BAHAMAS">WALKER CAY, BAHAMAS</option>

                <option value="WALLHAMN,  SWEDEN">WALLHAMN, SWEDEN</option>

                <option value="WALVIS BAY, NAMIBIA">WALVIS BAY, NAMIBIA</option>

                <option value="WARREN POINT, NORTHERN IRELAND">
                  WARREN POINT, NORTHERN IRELAND
                </option>

                <option value="WARRI, NIGERIA">WARRI, NIGERIA</option>

                <option value="WASHINGTON ISLAND, KIRIBAT">
                  WASHINGTON ISLAND, KIRIBAT
                </option>

                <option value="WATERFORD, IRELAND">WATERFORD, IRELAND</option>

                <option value="WEIPA, AUSTRAL">WEIPA, AUSTRAL</option>

                <option value="WELLINGTON, NEW ZEALAND">
                  WELLINGTON, NEW ZEALAND
                </option>

                <option value="WENZHOW CHINA">WENZHOW CHINA</option>

                <option value="WEST END, BAHAMAS">WEST END, BAHAMAS</option>

                <option value="WESTERNPORT, AUS">WESTERNPORT, AUS</option>

                <option value="WEWAK, PAPUA NEW GUINEA">
                  WEWAK, PAPUA NEW GUINEA
                </option>

                <option value="WILHELMSHAVEN, FR GERMANY">
                  WILHELMSHAVEN, FR GERMANY
                </option>

                <option value="WISMAR, FR GERMANY">WISMAR, FR GERMANY</option>

                <option value="WOODBRIDGE BAY, DOMINICA ISLD">
                  WOODBRIDGE BAY, DOMINICA ISLD
                </option>

                <option value="XIAMEN">XIAMEN</option>

                <option value="XIAMEN,CHINA">XIAMEN,CHINA</option>

                <option value="XIAMEN;HSIA MEN,AMOY, CHINA">
                  XIAMEN;HSIA MEN,AMOY, CHINA
                </option>

                <option value="XINGANG">XINGANG</option>

                <option value="XINGANG TIANJIN, CHINA">
                  XINGANG TIANJIN, CHINA
                </option>

                <option value="XINGANG, CHINA">XINGANG, CHINA</option>

                <option value="XINHUI, CHINA">XINHUI, CHINA</option>

                <option value="YALOVA, TURKEY">YALOVA, TURKEY</option>

                <option value="YANGSHAN, CHINA">YANGSHAN, CHINA</option>

                <option value="YANTIAN">YANTIAN</option>

                <option value="YANTIAN, CHINA">YANTIAN, CHINA</option>

                <option value="YANTIAN, CHINA M">YANTIAN, CHINA M</option>

                <option value="YAP, MICRONESIA">YAP, MICRONESIA</option>

                <option value="YARIMCA, IZMIT, TURKEY">
                  YARIMCA, IZMIT, TURKEY
                </option>

                <option value="YICHANG">YICHANG</option>

                <option value="YILPORT">YILPORT</option>

                <option value="YINGKOU, CHINA">YINGKOU, CHINA</option>

                <option value="YXPILA; YKSPIHLAJA, FINLAND">
                  YXPILA; YKSPIHLAJA, FINLAND
                </option>

                <option value="ZADAR, CROATIA">ZADAR, CROATIA</option>

                <option value="ZAFIRA, EQUATORIAL GUINEA">
                  ZAFIRA, EQUATORIAL GUINEA
                </option>

                <option value="ZAMBOANGA, PHILIPPINES">
                  ZAMBOANGA, PHILIPPINES
                </option>

                <option value="ZANTE; ZAKINTHOS, GREECE">
                  ZANTE; ZAKINTHOS, GREECE
                </option>

                <option value="ZANZIBAR, TANZANIA">ZANZIBAR, TANZANIA</option>

                <option value="ZARATE, ARGENTINA">ZARATE, ARGENTINA</option>

                <option value="ZEEBRUGGE, BELGIUM">ZEEBRUGGE, BELGIUM</option>

                <option value="ZHANGJIAGANG; ZHENJIANG, CHINA">
                  ZHANGJIAGANG; ZHENJIANG, CHINA
                </option>

                <option value="ZHONGSHAN, CHINA M">ZHONGSHAN, CHINA M</option>

                <option value="ZHUHAI ">ZHUHAI </option>
              </Form.Select>
              <Form.Text className="error">
                {errors.portOfDischarge ? errors.portOfDischarge?.message : ""}
              </Form.Text>
            </div>
            <div className="seconddiv">
              <FormInput
                formProps={{
                  control,
                  name: "placeOfDelivery",
                  label: "PLACE OF DELIVERY",
                }}
                mandatory={true}
              />
            </div>
            <div className="thirddiv">
              <Form.Label htmlFor="typeOfMove">TYPE OF MOVE</Form.Label>
              <Form.Select
                aria-label="Default select example"
                {...register("typeOfMove")}
                name="typeOfMove"
                className="fields_r rselect"
                id="typeOfMove"
              >
                <option value="PortToPort">Port To Port</option>
                <option value="PortToRamp">Port To Ramp</option>
                <option value="PortToDoor">Port To Door</option>
                <option value="RampToPort">Ramp To Port</option>
                <option value="RampToRamp">Ramp To Ramp</option>
                <option value="RampToDoor">Ramp To Door</option>
                <option value="DoorToPort">Door To Port</option>
                <option value="DoorToRamp">Door To Ramp</option>
                <option value="DoorToDoor">Door To Door</option>
                <option value="CY/CY">CY/CY</option>
                <option value="CFS/CFS">CFS/CFS</option>
                <option value="CFS/CY">CFS/CY</option>
                <option value="CY/Door">CY/Door</option>
                <option value="CFS/Door">CFS/Door</option>
                <option value="PortToPort">
                  (Port, Ramp or CY) to (Port, Ramp or CY)
                </option>
                <option value="PortToDoor">(Port, Ramp or CY) to Door</option>
                <option value="DoorToPort">Door to (Port, Ramp or CY)</option>
              </Form.Select>
              <Form.Text className="error">
                {errors.typeOfMove ? errors.typeOfMove?.message : ""}
              </Form.Text>
            </div>
          </div>
        </div>
        <div className="third-container">
          <div className="firstdiv">
            <p>CONTAINER & CARGO</p>
          </div>
          <div className="seconddiv">
            <label className="light bold" htmlFor="shipmentType">
              SHIPMENT TYPE
            </label>
            <input
              {...register("shipmentType")}
              onClick={(e) => onChangeShipment(e.target.value)}
              type="radio"
              name="shipmentType"
              value="lcl"
            />
            <i className="lignt">LCL</i>
            <input
              {...register("shipmentType")}
              onClick={(e) => onChangeShipment(e.target.value)}
              type="radio"
              name="shipmentType"
              value="fcl"
            />
            <i className="lignt">FCL</i>
          </div>
          <div className="thirddiv">
            <div className="cargocontainer">
              <div className="marksdiv">
                <label htmlFor="marksType">MARK AND NUMBERS</label>
                <div>
                  <input
                    {...register("marksType")}
                    type="radio"
                    name="marksType"
                    onClick={(e) => MarksChangeHandler(e.target.value)}
                    value="single"
                  />
                  <i className="lignt">Single</i>
                  <input
                    {...register("marksType")}
                    type="radio"
                    name="marksType"
                    value="multi"
                    onClick={(e) => MarksChangeHandler(e.target.value)}
                  />
                  <i className="lignt">Multi</i>
                </div>
              </div>
              <div className="packagesdiv">
                <p>
                  Number of packages<br></br>(Container type)
                </p>
              </div>
              <div className="descriptiondiv">
                <p>DESCRIPTION OF COMMODITIES</p>
                {watch("shipmentType") === "fcl" && (
                  <p>
                    <span>All FCL containers are subject to -</span> SHIPPER
                    LOAD STOW & COUNT
                  </p>
                )}
              </div>
              <div className="grossweight">
                <p>GROSS WEIGHT</p>
                <p>(kilos)</p>
              </div>
              <div className="measurement">
                <p>MEASUREMENT</p>
                <p>(CBM)</p>
              </div>
            </div>
            <div>
              {fields.map((item, index) => {
                return (
                  <div className="cargoItemContainer">
                    {
                      <div
                        className={`marksdiv ${
                          index != 0 && watch("marksType") === "single"
                            ? "hidden"
                            : ""
                        }`}
                      >
                        <TextArea
                          formProps={{
                            control,
                            name: `cargoItems.${index}.marksAndNumbers`,
                          }}
                          row="3"
                          cols="59"
                          className="ctext"
                          parentClassName="ctextdiv"
                        />
                      </div>
                    }
                    <div className="packagesdiv">
                      <div className="col-flex">
                        <input
                          {...register(`cargoItems.${index}.containerText`)}
                          disabled={watch("shipmentType") === "lcl"}
                          type="text"
                          className="field_r"
                        />
                        <Form.Text className="error">
                          {errors?.cargoItems
                            ? errors.cargoItems[index]?.containerText
                              ? errors.cargoItems[index]?.containerText.message
                              : ""
                            : ""}
                        </Form.Text>
                        <Controller
                          name={`cargoItems.${index}.containerType`}
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <>
                              <select
                                {...field}
                                disabled={watch("shipmentType") === "lcl"}
                                name="containerType"
                                id="containerType"
                                className="fields_r seconddivselect rselect"
                              >
                                <option value=""></option>
                                <option value="10G1">
                                  10 Foot Dry (10' x 8' x 8') - 10G1
                                </option>
                                <option value="2000">20' DV</option>
                                <option value="20B0">
                                  20 Foot Bulk (20' x 8' x 8') - 20B0
                                </option>
                                <option value="20B1">
                                  20 Foot Bulk (20' x 8' x 8') - 20B1
                                </option>
                                <option value="20B3">
                                  20 Foot Bulk (20' x 8' x 8') - 20B3
                                </option>
                                <option value="20B4">
                                  20 Foot Bulk (20' x 8' x 8') - 20B4
                                </option>
                                <option value="20B5">
                                  20 Foot Bulk (20' x 8' x 8') - 20B5
                                </option>
                                <option value="20B6">
                                  20 Foot Bulk (20' x 8' x 8') - 20B6
                                </option>
                                <option value="20FR">
                                  20 Foot Flat Rack - 20FR
                                </option>
                                <option value="20G0">
                                  20 Foot Dry (20' x 8' x 8') - 20G0
                                </option>
                                <option value="20G1">
                                  20 Foot Dry (20' x 8' x 8') - 20G1
                                </option>
                                <option value="20G2">
                                  20 Foot Dry (20' x 8' x 8') - 20G2
                                </option>
                                <option value="20G3">
                                  20 Foot Dry (20' x 8' x 8') - 20G3
                                </option>
                                <option value="20H0">
                                  20 Foot Insulated (20' x 8' x 8') - 20H0
                                </option>
                                <option value="20H1">
                                  20 Foot Insulated (20' x 8' x 8') - 20H1
                                </option>
                                <option value="20H2">
                                  20 Foot Insulated (20' x 8' x 8') - 20H2
                                </option>
                                <option value="20H5">
                                  20 Foot Insulated (20' x 8' x 8') - 20H5
                                </option>
                                <option value="20H6">
                                  20 Foot Insulated (20' x 8' x 8') - 20H6
                                </option>
                                <option value="20P1">
                                  20 Foot Flat (20' x 8' x 8') - 20P1 (O)
                                </option>
                                <option value="20P2">
                                  20 Foot Flat (20' x 8' x 8') - 20P2 (O)
                                </option>
                                <option value="20P3">
                                  20 Foot Flat Collapsible (20' x 8' x 8') -
                                  20P3 (O)
                                </option>
                                <option value="20P4">
                                  20 Foot Flat Collapsible (20' x 8' x 8') -
                                  20P4 (O)
                                </option>
                                <option value="20P5">
                                  20 Foot Platform Superstructure (20' x 8' x
                                  8') - (O)
                                </option>
                                <option value="20R0">
                                  20 Foot Reefer (20' x 8' x 8') - 20R0 (R)
                                </option>
                                <option value="20R1">
                                  20 Foot Reefer (20' x 8' x 8') - 20R1 (R)
                                </option>
                                <option value="20R2">
                                  20 Foot Reefer (20' x 8' x 8') - 20R2 (R)
                                </option>
                                <option value="20R3">
                                  20 Foot Reefer (20' x 8' x 8') - 20R3 (R)
                                </option>
                                <option value="20R8">
                                  20 Foot Reefer (20' x 8' x 8') - 20R8 (R)
                                </option>
                                <option value="20R9">
                                  20 Foot Reefer (20' x 8' x 8') - 20R9 (R)
                                </option>
                                <option value="20T0">
                                  20 Foot Tank (20' x 8' x 8') - 20T0
                                </option>
                                <option value="20T1">
                                  20 Foot Tank (20' x 8' x 8') - 20T1
                                </option>
                                <option value="20T2">
                                  20 Foot Tank (20' x 8' x 8') - 20T2
                                </option>
                                <option value="20T3">
                                  20 Foot Tank for Dangerous Liquid (20' x 8' x
                                  8'){" "}
                                </option>
                                <option value="20T4">
                                  20 Foot Tank for Dangerous Liquid (20' x 8' x
                                  8'){" "}
                                </option>
                                <option value="20T5">
                                  20 Foot Tank for Dangerous Liquid (20' x 8' x
                                  8'){" "}
                                </option>
                                <option value="20T6">
                                  20 Foot Tank for Dangerous Liquid (20' x 8' x
                                  8'){" "}
                                </option>
                                <option value="20T7">
                                  20 Foot Tank for Gas (20' x 8' x 8') - 20T7
                                </option>
                                <option value="20T8">
                                  20 Foot Tank for Gas (20' x 8' x 8') - 20T8
                                </option>
                                <option value="20T9">
                                  20 Foot Tank for Gas (20' x 8' x 8') - 20T9
                                </option>
                                <option value="20U0">
                                  20 Foot Open Top (20' x 8' x 8') - 20U0 (O)
                                </option>
                                <option value="20U1">
                                  20 Foot Open Top (20' x 8' x 8') - 20U1 (O)
                                </option>
                                <option value="20U2">
                                  20 Foot Open Top (20' x 8' x 8') - 20U2 (O)
                                </option>
                                <option value="20U3">
                                  20 Foot Open Top (20' x 8' x 8') - 20U3 (O)
                                </option>
                                <option value="20U4">
                                  20 Foot Open Top (20' x 8' x 8') - 20U4 (O)
                                </option>
                                <option value="20U5">
                                  20 Foot Open Top (20' x 8' x 8') - 20U5 (O)
                                </option>
                                <option value="20V0">
                                  20 Foot Ventilated (20' x 8' x 8') - 20V0
                                </option>
                                <option value="20V2">
                                  20 Foot Ventilated (20' x 8' x 8') - 20V2
                                </option>
                                <option value="20V4">
                                  20 Foot Ventilated (20' x 8' x 8') - 20V4
                                </option>
                                <option value="22B0">20' Bulk</option>
                                <option value="22B1">
                                  20 Foot Bulk (20' x 8'6'' x 8') - 22B1
                                </option>
                                <option value="22B3">
                                  20 Foot Bulk (20' x 8'6'' x 8') - 22B3
                                </option>
                                <option value="22B4">
                                  20 Foot Bulk (20' x 8'6'' x 8') - 22B4
                                </option>
                                <option value="22B5">
                                  20 Foot Bulk (20' x 8'6'' x 8') - 22B5
                                </option>
                                <option value="22B6">
                                  20 Foot Bulk (20' x 8'6'' x 8') - 22B6
                                </option>
                                <option value="22G0">20' Standard Dry</option>
                                <option value="22G1">20' SD</option>
                                <option value="22G2">20' Dry - 22G2</option>
                                <option value="22G3">20' Dry - 22G3</option>
                                <option value="22G4">20' GP</option>
                                <option value="22G8">
                                  20' General Purpose Dry
                                </option>
                                <option value="22G9">
                                  20' General Purpose
                                </option>
                                <option value="22H0">
                                  20' Reefer/Insulated (R)
                                </option>
                                <option value="22H2">
                                  20' RF/Insulated (R)
                                </option>
                                <option value="22P1">20' Flat (O)</option>
                                <option value="22P2">
                                  20 Foot Flat (20' x 8'6'' x 8') - 22P2 (O)
                                </option>
                                <option value="22P3">
                                  20' Flat Collapsible (O)
                                </option>
                                <option value="22P5">
                                  20' Platform Superstructure (O)
                                </option>
                                <option value="22P7">20' Platform (O)</option>
                                <option value="22P8">
                                  20 Foot Platform (20' x 8'6'' x 8') - 22P8 (O)
                                </option>
                                <option value="22P9">
                                  20 Foot Platform (20' x 8'6'' x 8') - 22P9 (O)
                                </option>
                                <option value="22R0">
                                  20' Reefer/ Mechanical (R)
                                </option>
                                <option value="22R1">
                                  20' Reefer/ Mechanical (R)
                                </option>
                                <option value="22R7">20' Reefer (R)</option>
                                <option value="22R9">20' RF (R)</option>
                                <option value="22S1">20' Automobile</option>
                                <option value="22T0">20' Tank</option>
                                <option value="22T1">
                                  20 Foot Tank (20' x 8'6'' x 8') - 22T1
                                </option>
                                <option value="22T2">
                                  20 Foot Tank (20' x 8'6'' x 8') - 22T2
                                </option>
                                <option value="22T3">
                                  20 Foot Tank for Dangerous Liquid (20' x 8'6''
                                  x 8
                                </option>
                                <option value="22T4">
                                  20 Foot Tank for Dangerous Liquid (20' x 8'6''
                                  x 8
                                </option>
                                <option value="22T5">
                                  20 Foot Tank for Dangerous Liquid (20' x 8'6''
                                  x 8
                                </option>
                                <option value="22T6">
                                  20 Foot Tank for Dangerous Liquid (20' x 8'6''
                                  x 8
                                </option>
                                <option value="22T7">
                                  20 Foot Tank for Gas (20' x 8'6'' x 8') - 22T7
                                </option>
                                <option value="22T8">
                                  20 Foot Tank for Gas (20' x 8'6'' x 8') - 22T8
                                </option>
                                <option value="22U0">20' Open Top (O)</option>
                                <option value="22U1">20' OT (O)</option>
                                <option value="22U6">20' Hard Top</option>
                                <option value="22UP">20 Hard Top - 22UP</option>
                                <option value="22V0">
                                  20' GP / Ventilated
                                </option>
                                <option value="22V2">
                                  20' DV / Mechanical
                                </option>
                                <option value="22V3">20' Dry Ventilated</option>
                                <option value="22VH">20 Ventilated</option>
                                <option value="25G0">20' High Cube Dry</option>
                                <option value="25R1">
                                  20' High Cube Reefer
                                </option>
                                <option value="26G0">20' HC Dry</option>
                                <option value="26H0">
                                  20' High Cube Reefer/Insulated
                                </option>
                                <option value="26T0">20' High Cube Tank</option>
                                <option value="28P0">
                                  20 Foot Platform (20' x 4'3'' x 8') - 28P0 (O)
                                </option>
                                <option value="28T8">
                                  20 Foot Tank for Gas (20' x 4'3'' x 8') - 28T8
                                </option>
                                <option value="28U1">
                                  20 Foot Open Top (20' x 4'3'' x 8') - 28U1 (O)
                                </option>
                                <option value="28V0">
                                  20 Foot Ventilated (20' x 4'3'' x 8') - 28V0
                                </option>
                                <option value="29P0">
                                  20 Foot Platform (20' x 4' x 8') - 29P0 (O)
                                </option>
                                <option value="2EG0">
                                  20 Foot High Cube Dry (20' x 9'6'' x 8'/8'2'')
                                  - 2
                                </option>
                                <option value="4000">40' DV</option>
                                <option value="42B0">40' Bulk</option>
                                <option value="42FR">
                                  40 Foot Flat Rack - 42FR
                                </option>
                                <option value="42G0">40' GP</option>
                                <option value="42G1">40' Standard Dry</option>
                                <option value="42H0">
                                  40' Reefer/Insulated (R)
                                </option>
                                <option value="42P1">40' Flat (O)</option>
                                <option value="42P2">
                                  40 Foot Flat (40' x 8'6'' x 8') - 42P2 (O)
                                </option>
                                <option value="42P3">
                                  40' Flat Collapsible (O)
                                </option>
                                <option value="42P5">
                                  40' Platform Superstructure (O)
                                </option>
                                <option value="42P6">40' Platform (O)</option>
                                <option value="42P8">
                                  40 Foot Platform (40' x 8'6'' x 8') - 42P8 (O)
                                </option>
                                <option value="42P9">
                                  40 Foot Platform (40' x 8'6'' x 8') - 42P9 (O)
                                </option>
                                <option value="42R0">
                                  40' Reefer/ Mechanical (R)
                                </option>
                                <option value="42R1">
                                  40' Reefer/ Mechanical (R)
                                </option>
                                <option value="42R3">40' RF (R)</option>
                                <option value="42R9">40' Reefer (R)</option>
                                <option value="42S1">40' Automobile</option>
                                <option value="42T0">40' Tank</option>
                                <option value="42T2">
                                  40 Foot Tank (40' x 8'6'' x 8') - 42T2
                                </option>
                                <option value="42T5">
                                  40 Foot Tank for Dangerous Liquid (40' x 8'6''
                                  x 8
                                </option>
                                <option value="42T6">
                                  40 Foot Tank for Dangerous Liquid (40' x 8'6''
                                  x 8
                                </option>
                                <option value="42T8">
                                  40 Foot Tank for Gas (40' x 8'6'' x 8') - 42T8
                                </option>
                                <option value="42U1">40' Open Top (O)</option>
                                <option value="42U6">40' Hard Top</option>
                                <option value="42UP">40 Hard Top</option>
                                <option value="42V0">40' Dry Ventilated</option>
                                <option value="42VH">40 Ventilated</option>
                                <option value="45B3">40' High Cube Bulk</option>
                                <option value="45G0">40' High Cube Dry</option>
                                <option value="45G1">40' HC Dry</option>
                                <option value="45P3">
                                  40' High Cube Flat (O)
                                </option>
                                <option value="45P8">
                                  40' High Cube Platform (O)
                                </option>
                                <option value="45R1">40' HC Reefer (R)</option>
                                <option value="45R9">
                                  40' High Cube Reefer (R)
                                </option>
                                <option value="45U1">
                                  40' High Cube Open Top (O)
                                </option>
                                <option value="45U6">
                                  40' High Cube Hardtop
                                </option>
                                <option value="46H0">
                                  40' High Cube Reefer/Insulated (R)
                                </option>
                                <option value="46P3">
                                  40' High Cube Flat Collapsible (O)
                                </option>
                                <option value="48P0">
                                  40 Foot Platform (40' x 4'3'' x 8') - 48P0 (O)
                                </option>
                                <option value="48T8">
                                  40 Foot Tank for Gas (40' x 4'3'' x 8') - 48T8
                                </option>
                                <option value="48U1">
                                  40 Foot Open Top (40' x 4'3'' x 8') - 48U1 (O)
                                </option>
                                <option value="49P0">
                                  40 Foot Platform (40' x 4' x 8') - 49P0 (O)
                                </option>
                                <option value="4CG0">
                                  40 Foot Dry (40' x 8'6'' x 8'/8'2'') - 4CG0
                                </option>
                                <option value="CONT">CONTAINERS</option>
                                <option value="L0G1">
                                  45 Foot Dry (45' x 8' x 8') - L0G1
                                </option>
                                <option value="L2G1">45' Dry</option>
                                <option value="L2P1">45' Platform</option>
                                <option value="L2R1">
                                  45' Reefer/Mechanical (R)
                                </option>
                                <option value="L2T0">45' Tank</option>
                                <option value="L2U1">45' Open Top (O)</option>
                                <option value="L5G0">45' High Cube Dry</option>
                                <option value="L5G1">45' High Cube Dry </option>
                                <option value="L5R0">
                                  45' High Cube Reefer (R)
                                </option>
                                <option value="L5R1">
                                  45' HC Reefer / Mechanical (R)
                                </option>
                                <option value="L5R2">45' HCRF (R)</option>
                                <option value="L5R3">45' HC Reefer (R)</option>
                                <option value="L5R4">
                                  45' High Cube Reefer (R)
                                </option>
                                <option value="L5R8">
                                  45 Foot High Cube Reefer (45' x 9'6'' x 8') -
                                  L5R8 (R)
                                </option>
                                <option value="L5R9">
                                  45 Foot High Cube Reefer (45' x 9'6'' x 8') -
                                  L5R9 (R)
                                </option>
                                <option value="LDG1">
                                  45 Foot High Cube Dry (45' x 9' x 8'/8'2'') -
                                  LDG1
                                </option>
                                <option value="LDG8">
                                  45 Foot High Cube General Purpose / Dry (45' x
                                  9'{" "}
                                </option>
                                <option value="LEG1">
                                  45 Foot High Cube Dry (45' x 9'6'' x 8'/8'2'')
                                  - L
                                </option>
                                <option value="LEG8">
                                  45 Foot High Cube General Purpose / Dry (45' x
                                  9'6
                                </option>
                                <option value="LEG9">
                                  45 Foot High Cube General Purpose / Dry (45' x
                                  9'6
                                </option>
                                <option value="LLG1">
                                  45 Foot Dry (45' x 8'6'' x &gt;8'2'') - LLG1
                                </option>
                                <option value="LNG1">
                                  45 Foot High Cube Dry (45' x 9'6'' x
                                  &gt;8'2'') - LNG
                                </option>
                                <option value="LNR1">
                                  45 Foot High Cube Reefer (45' x 9'6'' x
                                  &gt;8'2'') - (R)
                                </option>
                                <option value="M5G0">
                                  48 Foot High Cube - M5G0
                                </option>
                                <option value="P5G0">
                                  53 Foot High Cube - P5G0
                                </option>
                              </select>
                              <Form.Text className="error">
                                {errors?.cargoItems
                                  ? errors.cargoItems[index]?.containerType
                                    ? errors.cargoItems[index]?.containerType
                                        .message
                                    : ""
                                  : ""}
                              </Form.Text>
                            </>
                          )}
                        />
                      </div>
                      <div className="col-flex">
                        <input
                          {...register(`cargoItems.${index}.cargoText`)}
                          type="text"
                          className="field_b"
                        />
                        <Form.Text className="error">
                          {errors?.cargoItems
                            ? errors.cargoItems[index]?.cargoText
                              ? errors.cargoItems[index]?.cargoText.message
                              : ""
                            : ""}
                        </Form.Text>
                        <Controller
                          name={`cargoItems.${index}.cargoType`}
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <select
                              {...field}
                              name="cargoType"
                              id="cargoType"
                              className="fields_b seconddivselect bselect"
                            >
                              <option value=""></option>
                              <option value="AMM">AMMO PACK</option>
                              <option value="ATH">ATTACHMENT</option>
                              <option value="BAG">BAG</option>
                              <option value="BLE">BALE</option>
                              <option value="BDG">BANDING</option>
                              <option value="BRG">BARGE</option>
                              <option value="BBL">BARREL</option>
                              <option value="BSK">BASKET OR HAMPER</option>
                              <option value="BEM">BEAM</option>
                              <option value="BLT">BELTING</option>
                              <option value="BIB">BIG BAG</option>
                              <option value="BIN">BIN</option>
                              <option value="BIC">BING CHEST</option>
                              <option value="BLO">BLOCK</option>
                              <option value="BOB">BOBBIN</option>
                              <option value="BOT">BOTTLE</option>
                              <option value="BOX">BOX</option>
                              <option value="BXI">
                                BOX, WITH INNER CONTAINER
                              </option>
                              <option value="BRC">BRACING</option>
                              <option value="BXT">BUCKET</option>
                              <option value="BLK">BULK</option>
                              <option value="BKG">BULK BAG</option>
                              <option value="BDL">BUNDLE</option>
                              <option value="CAB">CABINET</option>
                              <option value="CAG">CAGE</option>
                              <option value="CAN">CAN</option>
                              <option value="CCS">CAN CASE</option>
                              <option value="CNC">CAN, CYLINDRICAL</option>
                              <option value="CNR">CAN, RECTANGULAR</option>
                              <option value="CLD">CAR LOAD, RAIL</option>
                              <option value="CBY">CARBOY</option>
                              <option value="CBN">CARBOY, NON-PROTECTED</option>
                              <option value="CBP">CARBOY, PROTECTED</option>
                              <option value="CAR">CARRIER</option>
                              <option value="CTN">CARTON</option>
                              <option value="CAS">CASE</option>
                              <option value="CSK">CASK</option>
                              <option value="CHE">CHEESES</option>
                              <option value="CHS">CHEST</option>
                              <option value="COL">COIL</option>
                              <option value="CLI">COLLI</option>
                              <option value="CON">CONE</option>
                              <option value="COR">CORE</option>
                              <option value="CRF">CORNER REINFORCEMENT</option>
                              <option value="CRD">CRADLE</option>
                              <option value="CRT">CRATE</option>
                              <option value="CUB">CUBE</option>
                              <option value="CYN">CYLINDER</option>
                              <option value="CYL">CYLINDER</option>
                              <option value="DRK">DOUBLE-LENGTH RACK</option>
                              <option value="DTB">
                                DOUBLE-LENGTH TOTE BIN
                              </option>
                              <option value="DRM">DRUM</option>
                              <option value="DBK">DRY BULK</option>
                              <option value="EPR">EDGE PROTECTION</option>
                              <option value="EGG">EGG CRATING</option>
                              <option value="ENV">ENVELOPE</option>
                              <option value="FIR">FIRKIN</option>
                              <option value="FSK">FLASK</option>
                              <option value="FXB">FLEXIBAG</option>
                              <option value="FLO">FLO-BIN</option>
                              <option value="FWR">FORWARD REEL</option>
                              <option value="FRM">FRAME</option>
                              <option value="GAL">GALLON</option>
                              <option value="HRK">HALF-STANDARD RACK</option>
                              <option value="HTB">
                                HALF-STANDARD TOTE BIN
                              </option>
                              <option value="HED">HEADS OF BEEF</option>
                              <option value="HGH">HOGSHEAD</option>
                              <option value="HPT">HOPPER TRUCK</option>
                              <option value="ITM">ITEM</option>
                              <option value="JAR">JAR</option>
                              <option value="JUG">JUG</option>
                              <option value="JBG">JUMBO BAG</option>
                              <option value="KEG">KEG</option>
                              <option value="KIT">KIT</option>
                              <option value="KRK">KNOCKDOWN RACK</option>
                              <option value="KTB">KNOCKDOWN TOTE BIN</option>
                              <option value="LIF">LIFT</option>
                              <option value="LVN">LIFT VAN</option>
                              <option value="LNR">LINER</option>
                              <option value="LID">LIP/TOP</option>
                              <option value="LBK">LIQUID BULK</option>
                              <option value="LOG">LOG</option>
                              <option value="LSE">LOOSE</option>
                              <option value="LUG">LUG</option>
                              <option value="MET">METAL PACKAGES</option>
                              <option value="MIX">MIXED CONTAINER TYPES</option>
                              <option value="MXD">MIXED TYPE PACK</option>
                              <option value="MRP">MULTI-ROLL PACK</option>
                              <option value="NOL">NOIL</option>
                              <option value="HRB">
                                ON HANGER OR RACK IN BOX
                              </option>
                              <option value="WHE">ON OWN WHEEL</option>
                              <option value="OVW">OVERWRAP</option>
                              <option value="PCK">
                                PACK-NOT OTHERWISE SPECIFIED
                              </option>
                              <option value="PKG">PACKAGE</option>
                              <option value="PAL">PAIL</option>
                              <option value="PLT">PALLET</option>
                              <option value="PCL">PARCEL</option>
                              <option value="PRT">PARTITIONING</option>
                              <option value="PCS">PIECE</option>
                              <option value="PIR">PIMS</option>
                              <option value="PRK">PIPE RACK</option>
                              <option value="PLN">PIPELINE</option>
                              <option value="PLF">PLATFORM</option>
                              <option value="PLC">
                                PRIMARY LIFT CONTAINER
                              </option>
                              <option value="POV">PRIVATE VEHICLE</option>
                              <option value="QTR">QUARTER OF BEEF</option>
                              <option value="RCK">RACK</option>
                              <option value="RAL">RAIL (SEMICONDUCTOR)</option>
                              <option value="REL">REEL</option>
                              <option value="RFT">REINFORCEMENT</option>
                              <option value="RVR">REVERSE REEL</option>
                              <option value="ROL">ROLL</option>
                              <option value="SAK">SACK</option>
                              <option value="SVN">SEAVAN - SEA VAN</option>
                              <option value="SPR">SEPERATOR\DIVIDER</option>
                              <option value="SET">SET</option>
                              <option value="SHT">SHEET</option>
                              <option value="SHK">SHOOK</option>
                              <option value="SHW">SHRINK WRAPPED</option>
                              <option value="SID">SIDE OF BEEF</option>
                              <option value="SKD">SKID</option>
                              <option value="SKE">
                                SKID, ELEVATING OF LIFT TRUCK
                              </option>
                              <option value="SLV">SLEEVE</option>
                              <option value="SLP">SLIP SHEET</option>
                              <option value="SB">SMALL BAG</option>
                              <option value="DSK">SOUBLE-LENGTH SKID</option>
                              <option value="SPI">SPIN CYLINDER</option>
                              <option value="SPL">SPOOL</option>
                              <option value="TNK">TANK</option>
                              <option value="TKR">TANK CAR</option>
                              <option value="TKT">TANK TRUCK</option>
                              <option value="TRC">TIERCE</option>
                              <option value="TIN">TIN</option>
                              <option value="TBN">TOTE BIN</option>
                              <option value="TTC">TOTE CAN</option>
                              <option value="TLD">
                                TRAILER\CONTAINER LOAD (RAIL)
                              </option>
                              <option value="TRY">TRAY</option>
                              <option value="TRK">TRUNK OR CHEST</option>
                              <option value="TSS">TRUNK,SALESMAN SAMPLE</option>
                              <option value="TUB">TUB</option>
                              <option value="TBE">TUBE</option>
                              <option value="UNT">UNIT</option>
                              <option value="UNP">UNPACKED</option>
                              <option value="VPK">VAN PACK</option>
                              <option value="VEH">VEHICLES</option>
                              <option value="WLC">WHEELED CARRIER</option>
                              <option value="DM2">WOODEN BOX</option>
                              <option value="WDC">WOODEN CASE</option>
                              <option value="DM1">WOODEN CRATE</option>
                              <option value="WRP">WRAPPED</option>
                            </select>
                          )}
                        />
                        <Form.Text className="error">
                          {errors?.cargoItems
                            ? errors.cargoItems[index]?.cargoType
                              ? errors.cargoItems[index]?.cargoType.message
                              : ""
                            : ""}
                        </Form.Text>
                      </div>
                    </div>
                    <div className="descriptiondiv">
                      <TextArea
                        formProps={{
                          control,
                          name: `cargoItems.${index}.description`,
                        }}
                        row="3"
                        cols="59"
                        className="ctext"
                        parentClassName="ctextdiv"
                      />
                      {/* <textarea
                          {...register(`cargoItems.${index}.description`)}
                          rows={7}
                          cols="59"
                          className="field_b"
                        />
                        <Form.Text className="error">
                          {errors?.cargoItems
                            ? errors.cargoItems[index]?.description?.message
                            : ""}
                        </Form.Text> */}
                    </div>
                    <div className="fourthdiv">
                      <FormInput
                        formProps={{
                          control,
                          name: `cargoItems.${index}.grossWeight`,
                        }}
                        className="cinput"
                      />
                      {/* <input
                          {...register(`cargoItems.${index}.grossWeight`)}
                          type="text"
                          className="field_r"
                         
                        /> */}
                      {/* <Form.Text className="error">
                          {errors?.cargoItems
                            ? errors.cargoItems[index]?.grossWeight?.message
                            : ""}
                        </Form.Text> */}
                    </div>
                    <div className="fifthdiv">
                      <FormInput
                        formProps={{
                          control,
                          name: `cargoItems.${index}.measurement`,
                        }}
                        // className="declaredinput"
                      />
                      {/* <input
                          {...register(`cargoItems.${index}.measurement`)}
                          type="text"
                          className="field_b"
                          onWheel={() => document.activeElement.blur()}
                          // name="measurement"
                        />
                        <Form.Text className="error">
                          {errors?.cargoItems
                            ? errors.cargoItems[index]?.measurement?.message
                            : ""}
                        </Form.Text> */}
                    </div>
                    <div>
                      {index != 0 && (
                        <DeleteIcon
                          style={{ color: "red" }}
                          onClick={() => remove(index)}
                        />
                      )}
                    </div>
                  </div>
                );
                // return <CargoItem key={item.id} item={item} index={index} />;
              })}
            </div>
          </div>
          <div className="btnContainer">
            <button type="button" onClick={() => addCargoItem()}>
              ADD DESCRIPTION OF COMMODITIES
            </button>
          </div>
        </div>
        <div className="fourth-container">
          <div className="policydiv">
            <p className="plicycontent light">
              Carrier has a policy against payment, solicitation, of receipt of
              any rebate, directy or indirectly, which would be unlawful under
              the United States Shipping Act, 1984 as amended.
            </p>
            <div className="declareddiv">
              <label htmlFor="declaredValue" className="light">
                DECLARED VALUE
              </label>
              <FormInput
                formProps={{
                  control,
                  name: "declaredValue",
                }}
                className="declaredinput"
              />
              <span className="light">
                READ CLAUSE 29 HEREOF CONCERNING EXTRA FREIGHT AND CARRIER'S
                LIMITATIONS OF LIABILITY.
              </span>
            </div>
          </div>
        </div>
        <div className="frieghtratescontainer">
          <div className="ratescontainer">
            <div className="rateTxt">
              <p className="light bold">
                FREIGHT RATES, WEIGHTS AND/OR MEASUREMENTS
              </p>
            </div>
            <div className="table">
              <table border="0" cellPadding="1" cellSpacing="0">
                <tbody>
                  <tr className="tableheader" height="24">
                    <td
                      className="light"
                      align="center"
                      valign="top"
                      width="170"
                    >
                      SUBJECT TO CORRECTION
                    </td>
                    <td
                      className="light"
                      align="center"
                      valign="top"
                      width="120"
                    >
                      PREPAID(USD)
                    </td>
                    <td
                      className="light"
                      align="center"
                      valign="top"
                      width="120"
                    >
                      COLLECT(USD)
                    </td>
                  </tr>
                  {cargoFields.map((item, index) => {
                    return (
                      <tr height="22" key={item.id}>
                        <td className="light cell" align="center" valign="top">
                          <FormInput
                            formProps={{
                              control,
                              name: `correction.${index}.subjectionCorrection`,
                            }}
                            size="30"
                            maxLength="40"
                            className="tableInput"
                          />
                        </td>
                        <td className="light cell" align="center" valign="top">
                          <FormInput
                            formProps={{
                              control,
                              name: `correction.${index}.prepaid`,
                            }}
                            size="12"
                            maxLength="10"
                            className="tableInput"
                          />
                        </td>
                        <td className="light cell" align="center" valign="top">
                          <FormInput
                            formProps={{
                              control,
                              name: `correction.${index}.collect`,
                            }}
                            size="12"
                            maxLength="10"
                            className="tableInput"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="issuedcontainer">
            <div className="text light">
              Received by Carrier for shipment ocean vessel between port of
              loading and port of discharge, and for arrangement or procurement
              of pre-carriage from place of receipt and on-carriage to place of
              delivery, where stated above, the good as specified above in
              apparent good order and condition unless otherwise stated. The
              goods to be delivered at the above mentioned port of discharge or
              place of delivery, whichever is applicable, subject always to the
              exceptions, limitations, conditions and liberties set out on the
              reverse side hereof, to which the Shipper and/or Consignee agree
              to accepting this Bill of Lading. IN WITNESS WHEREOF three (3)
              original Bills of lading have been signed, not otherwise stated
              above, one of which being accomplished the others shall be void.
            </div>
            <div className="issuedAtdiv">
              <FormInput
                formProps={{
                  control,
                  name: "issuedAt",
                  label: " Issued at:",
                }}
                disabled={true}
              />
              <FormInput
                formProps={{
                  control,
                  name: "issuedCountry",
                }}
                disabled={true}
              />
            </div>
            <div>
              <FormInput
                formProps={{
                  control,
                  name: "issuedBy",
                  label: " By :",
                }}
                disabled={true}
                divClassName="row-div"
              />
            </div>
            <div>
    
              <Form.Group className="pt-2">
                <Form.Label htmlFor="blDate" className="bldatelabel">
                  Date :
                </Form.Label>
                <Controller
                  name="blDate"
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                    <DatePicker  
                    {...field} 
                    defaultValue={null}
                    format="DD-MM-YYYY"  
                    className="muidatepicker"
                    value={field.value}
                    />
                  )}
                />
                {errors.date && (
                  <span className="error">{errors.blDate.message}</span>
                )}
              </Form.Group> 
              {/* <FormInput
                formProps={{
                  control,
                  name: "blDate",
                  label: "Date :",
                }}
                className="bldate"
                type="date"
                placeholder="DD-MM-YYYY"
              /> */}
            </div>
          </div>
        </div>
        <div className="bottomContainer">
          <button type="button" onClick={() => previewHbl()}>
            Preview
          </button>
          <button type="button" onClick={() => {resetHandler()}}>
            Reset
          </button>
          <button type="submit">Save</button>
        </div>
      </form>
    </section>
  );
};

export default Hbl;
