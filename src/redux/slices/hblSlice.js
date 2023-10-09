import { createSlice } from "@reduxjs/toolkit";

const  hblData  = {
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
    date: {},
    correction: [
    //   {
    //     subjectionCorrection: "",
    //     prepaid: "",
    //     collect: "",
    //   },
    //   {
    //     subjectionCorrection: "",
    //     prepaid: "",
    //     collect: "",
    //   },
    //   {
    //     subjectionCorrection: "",
    //     prepaid: "",
    //     collect: "",
    //   },
    //   {
    //     subjectionCorrection: "",
    //     prepaid: "",
    //     collect: "",
    //   },
    //   {
    //     subjectionCorrection: "",
    //     prepaid: "",
    //     collect: "",
    //   },
    //   {
    //     subjectionCorrection: "",
    //     prepaid: "",
    //     collect: "",
    //   },
    //   {
    //     subjectionCorrection: "",
    //     prepaid: "",
    //     collect: "",
    //   },
    ],
    prepaidtotal: 0,
}

const hblSlice = createSlice({
	name: "hbl",
    initialState : {hblData},
	reducers: {
		setHblData: (state, action) => {
			state.hblData = action.payload;
		},
        resetHblData: (state,action) => {
            state.hblData = hblData
            localStorage.clear()
        }
	},
});

export const { setHblData, resetHblData } =
hblSlice.actions;
export default hblSlice.reducer;
