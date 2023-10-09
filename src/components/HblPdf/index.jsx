import React, { useEffect } from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import moment from "moment/moment";

// Create styles
const styles = StyleSheet.create({
  body: {
    padding: 10,
    position: "relative"
  },
  boldText: {
    fontSize: 9,
    fontWeight: "bold",
  },
  billText: {
    fontSize: 9,
    fontWeight: "bold",
    marginRight: 20
  },
  text: {
    fontSize: 6,
  },
  smText: {
    fontSize: 7,
    lineHeight:1.5
  },
  title: {
    fontSize: 14,
    fontWeight: 900,
  },
  bText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  blueText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "blue",
  },
  redText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "red",
  },
  headerSection: {
    display: "flex",
    flexDirection: "row",
    borderBottom: "1px solid #000",
  },
  headerLeft: {
    flexBasis: "50%",
    paddingVertical: 7
  },
  headerRight: {
    flexBasis: "40%",
    paddingVertical: 7
  },
  textdiv: {
    marginTop: 5,
  },
  bill: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  firstContainer: {
    display: "flex",
    flexDirection: "row",
    borderBottom: "1px solid #000",
  },
  leftDiv: {
    minHeight: 100,
    flexBasis: "50%",
    borderRight: "1px solid #000",
    // padding:3
  },
  rightDiv: {
    width:"50%",
    // padding:3
  },
  shipperDiv: {
    minHeight: 80,
    // padding:3
  },
  notifyDiv: {
    minHeight: 80,
    borderBottom: "1px solid #000",
    // padding:3
  },
  documentDiv: {
    display: "flex",
    flexDirection: "row",
    justifyContent:"space-between",
    borderBottom: "1px solid #000",
    // padding:3
  },
  documentNoDiv: {
    borderRight: "1px solid #000",
    width:130,
    // padding:3
  },
  blNoDiv: {
    paddingLeft: 5,
    width:150,
    // padding:3
  },
  agentDiv: {
    minHeight: 70,
    borderBottom: "1px solid #000",
    // padding:3
  },
  notifySubDiv: {
    display: "flex",
    flexDirection: "row",
  },
  preCarriage: {
    flexBasis: "50%",
    borderRight: "1px solid #000",
    minHeight:20,
    // padding:3
  },
  rpreCarriage: {
    flexBasis: "50%",
    minHeight:20,
    // padding:3
  },
  one: {
    flexBasis: "25%",
    borderRight: "1px solid #000",
    minHeight:20,
    padding:3
  },
  two: {
    flexBasis: "25%",
    borderRight: "1px solid #000",
    minHeight:20,
    padding:3
  },
  three: {
    flexBasis: "50%",
    minHeight:20,
    padding:3
  },
  oneD: {
    flexBasis: "25%",
    borderRight: "1px solid #000",
    minHeight:20,
    padding:3
  },
  twoD: {
    flexBasis: "25%",
    borderRight: "1px solid #000",
    minHeight:20,
    padding:3
  },
  threeD: {
    flexBasis: "30%",
    borderRight: "1px solid #000",
    minHeight:20,
    padding:3
  },
  fourD: {
    flexBasis: "20%",
    minHeight:20,
    padding:3
  },
  fouthContainer: {
    borderBottom: "1px solid #000",
    display: "flex",
    flexDirection: "column",
  },
  declaredValue: {
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
  },
  dotted: {
    marginLeft: 20,
    width: 100,
    fontSize: 10,
    color: "blue",
    borderBottom: "1px dashed #000",
  },
  fifthContainer: {
    borderBottom: "1px solid #000",
    marginTop: 5,
    paddingBottom: 10,
  },
  sixthContainer: {
    display: "flex",
    flexDirection: "row",
  },
  rateDiv: {
    flexBasis: "50%",
    borderRight: "1px solid #000",
  },
  bottomRight: {
    flexBasis: "50%",
  },
  caldiv: {
    display: "flex",
    flexDirection: "row",
  },
  vcalDiv: {
    display: "flex",
    flexDirection: "row",
    minHeight:10
  },
  subjdiv: {
    flexBasis: "50%",
    borderRight: "1px solid #000",
    borderBottom: "1px solid #000",
    minHeight: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  prepaiddiv: {
    flexBasis: "25%",
    borderBottom: "1px solid #000",
    borderRight: "1px solid #000",
    minHeight: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  totalsum: {
    flexBasis: "25%",
    borderRight: "1px solid #000",
    minHeight: 20,
    borderTop: "1px solid #000",
    display: "flex",
    flexDirection: 'row',
    justifyContent:"space-between"
  },
  totalcollect: {
    borderTop: "1px solid #000",
    flexBasis: "25%",
    flexDirection: 'row',
    justifyContent:"space-between"
  },
  collectdiv: {
    flexBasis: "25%",
    borderBottom: "1px solid #000",
    minHeight: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  vsubjdiv: {
    flexBasis: "50%",
    borderRight: "1px solid #000",
    paddingBottom: 2,
    minHeight: 20
  },
    vprepaiddiv: {
    flexBasis: "25%",
    borderRight: "1px solid #000",
    paddingBottom: 2,
    minHeight: 20,
    display:"flex",
    flexDirection:"row",
    justifyContent:"flex-end"
  },
   vcollectdiv: {
    flexBasis: "25%",
    paddingBottom: 2,
    minHeight: 20,
    display:"flex",
    flexDirection:"row",
    justifyContent:"flex-end"
  },
  freightDiv: {
    borderBottom: "1px solid #000",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    minHeight:20
  },
  textContainer: {
    padding: 5,
  },
  issuedDiv: {
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 5,
    paddingVertical: 3
  },
  underlingText: {
    fontSize: 8,
    color: "blue",
    borderBottom: "1px solid #000",
    marginLeft: 5,
    flexBasis:"90%"
  },
  bunderlingText: {
    fontSize: 8,
    color: "blue",
    borderBottom: "1px solid #000",
    marginLeft: 5,
    flexBasis:"97%"
  },
  centerText: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 4
  },
  dateContainer: {
    borderTop: "1px solid #000",
    height: 30,
    padding: 6,
    marginBottom: 6
  },
  dateDiv: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 6
  },
  oneDate: {
    flexBasis: "33%",
    fontSize: 8,
    textAlign: "center",
    color: "blue"
  },
  twoDate: {
    flexBasis: "33%",
    fontSize: 8,
    textAlign: "center",
    color: "blue"
  },
  threeDate: {
    flexBasis: "33%",
    fontSize: 8,
    textAlign: "center",
    color: "blue"
  },
  totaldiv: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexBasis: "50%",
    borderRight: "1px solid #000",
    borderTop: "1px solid #000",
  },
  cargoHeader: {
    display: "flex",
    flexDirection: "row",
  },
  vcargoHeader: {
     display: "flex",
    flexDirection: "row",
  },
  cOne: {
    flexBasis: "15%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRight: "1px solid #000",
    borderBottom: "1px solid #000"
  },
  ctwo: {
    flexBasis: "15%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRight: "1px solid #000",
    borderBottom: "1px solid #000"
  },
  cthree: {
    flexBasis: "60%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
      borderRight: "1px solid #000",
    borderBottom: "1px solid #000"
  },
  cfour: {
    flexBasis: "15%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
      borderRight: "1px solid #000",
    borderBottom: "1px solid #000"
  },
  cfive: {
    flexBasis: "15%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderBottom: "1px solid #000"
  },
  dOne: {
    flexBasis: "15%",
    borderRight: "1px solid #000",
    minHeight: 100
  },
  dTwo: {
    flexBasis: "15%",
    borderRight: "1px solid #000",
    minHeight: 100
  },
  dThree: {
    flexBasis: "60%",
    // padding: 5,
    borderRight: "1px solid #000",
    // minHeight: 100
  },
  desThree: {
    flexBasis: "60%",
    // padding: 5,
    borderRight: "1px solid #000",
    textAlign: "center"
    // minHeight: 100
  },
  vtwo: {
    flexBasis: "15%",
    borderRight: "1px solid #000",
    minHeight: 110
  },
  dFour: {
    flexBasis: "15%",
    borderRight: "1px solid #000",
    // minHeight: 100
  },
  dFive: {
    flexBasis: "15%",
    // minHeight: 100
  },
  vOne: {
    flexBasis: "15%",
    borderRight: "1px solid #000",
    minHeight: 20
  },
  vthree: {
    flexBasis: "60%",
    borderRight: "1px solid #000",
    minHeight: 20
  },
  vfour: {
    flexBasis: "15%",
    minHeight: 20,
    borderRight: "1px solid #000",
  },
  vfive: {
    flexBasis: "15%",
    minHeight: 20
  },
  packdiv: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap"
  },
   typeDiv: {
    flexBasis: "15%",
    borderRight: "1px solid #000",
  },
  dtypeDiv: {
    flexBasis: "15%",
    borderRight: "1px solid #000",
  },
  vCargoDiv: {
    minHeight: 100
  },
  watermark: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
    transform: 'rotate(330deg)', 
  },
  watermarkText: {
    fontSize: 60,
    fontWeight: 1000,
    color: 'red',
  },
  checkboxContainer: {
    display: "flex",
    flexDirection: 'row',
    alignItems: 'center',    
  },
  checkbox: {
    width: 12,
    height: 12,
    border: '1pt solid black',
    marginRight: 5,
    borderRadius: 2
  },
  uncheckmark: {
    width: 12,
    height: 12,
    border: '1px solid black',
    marginRight: 5,
    borderRadius: 2
  },
  checkmark: {
    position: 'relative',
    width: 10,
    height: 5,
    transform: 'rotate(320deg)',
    top: 1,
    left: 1,
    border: '1pt solid black',
    borderTop: 'none',
    borderRight: 'none',
  },
 
});

export const HblPdf = (props) => {

  let data = {...props}

  console.log(data,"blData")

  data.blDate = moment(data.blDate,"YYYY-MM-DD")

  console.log(moment(data.blDate,"YYYY-MM-DD").format("MMM"),"sdfa")

  let fieldArr = [...props.cargoItems]

  let correction = [...props.correction]

  const insertEmptyCargoData = (fieldArr) => {
    
    let initialfields = {
      containerText: "",
      containerType: "",
      cargoText: "",
      cargoType: "",
      marksAndNumbers: "",
      description: "",
      grossWeight: "",
      measurement: "",
    };
    if(fieldArr.length != 7){
      fieldArr.push(initialfields)
      insertEmptyCargoData(fieldArr)
    }
  }

  insertEmptyCargoData(fieldArr)

  insertEmptyCargoData(correction)
 
  return (
    <Document>
      <Page size="A4" style={styles.body}>
      <View style={styles.watermark}>
        <Text style={styles.watermarkText}>DRAFT</Text>
      </View>
        <View style={styles.headerSection}>
          <View style={styles.headerLeft}>
            <Text style={styles.text}>Carrier :</Text>
            <Text style={styles.title}>ALL WORLD SHIPPING CORP.</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.bill}>
              <Text style={styles.boldText}>Bill of Lading</Text>
              <Text style={styles.billText}>OTI # 17745N</Text>
            </View>
            <View style={styles.textdiv}>
              <Text style={styles.boldText}>
                For Combined Transport or Port to Port Shipment
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.firstContainer}>
          <View style={styles.leftDiv}>
            <View style={styles.shipperDiv}>
              <Text style={styles.text}>SHIPPER</Text>
              <Text style={styles.blueText}>{data?.shipper?.shipperName}</Text>
            </View>
          </View>
          <View className={styles.rightDiv}>
            <View style={styles.documentDiv}>
              <View style={styles.documentNoDiv}>
                <Text style={styles.text}>DOCUMENT NUMBER</Text>
                <Text style={styles.blueText}>
                  {data?.shipper?.documentNo}
                </Text>
              </View>
              <View style={styles.blNoDiv}>
                <Text style={styles.text}>B/L NUMBER</Text>
                <Text style={styles.redText}>N/A</Text>
              </View>
            </View>
            <View>
              <Text style={styles.text}>EXPORT REFERENCES</Text>
              <Text style={styles.blueText}>
                {data?.shipper?.shipperExportReferences}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.firstContainer}>
          <View style={styles.leftDiv}>
            <View style={styles.shipperDiv}>
              <Text style={styles.text}>CONSIGNEE</Text>
              <Text style={styles.blueText}>
                {data?.consignee?.consigneeName}
              </Text>
            </View>
          </View>
          <View style={styles.rightDiv}>
            <View style={styles.agentDiv}>
              <Text style={styles.text}>DESTINATION AGENT</Text>
              <Text style={styles.blueText}>
                {data?.consignee?.destinationAgent}
              </Text>
            </View>
            <View>
              <Text style={styles.text}>
                POINT(STATE) OF ORIGIN OR F T Z NUMBER
              </Text>
              <Text style={styles.blueText}>
                {data?.consignee?.pointStateOfOrigin}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.firstContainer}>
          <View style={styles.leftDiv}>
            <View style={styles.notifyDiv}>
              <Text style={styles.text}>NOTIFY PARTY</Text>
              <Text style={styles.blueText}>
                {data?.notifyParty?.notifyPartyName}
              </Text>
            </View>
            <View style={styles.notifySubDiv}>
              <View style={styles.preCarriage}>
                <Text style={styles.text}>{data?.preCarriageBy}PRE-CARRIAGE BY</Text>
                <Text style={styles.blueText}>{data?.preCarriageBy}</Text>
              </View>
              <View style={styles.rpreCarriage}>
                <Text style={styles.text}>PLACE OF RECEIPT BY PRE-CARRIER</Text>
                <Text style={styles.blueText}>
                  {data?.placeOfReceiptByPreCarrier}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.rightDiv}>
            <View>
              <Text style={styles.text}>EXPORT INSTRUCTIONS</Text>
              <Text style={styles.blueText}>
                {data?.notifyParty?.notifyPartyExportReferences}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.firstContainer}>
          <View style={styles.one}>
            <Text style={styles.text}>EXPORTING CARRIER VOYAGE #</Text>
            <Text style={styles.blueText}>{data?.exportVessel}</Text>
          </View>
          <View style={styles.two}>
            <Text style={styles.text}>PORT OF LOADING</Text>
            <Text style={styles.blueText}>{data?.portOfLoading}</Text>
          </View>
          <View style={styles.three}>
            <Text style={styles.text}>LOADING PIER TERMINAL</Text>
            <Text style={styles.blueText}>{data?.loadingPier}</Text>
          </View>
        </View>
        <View style={styles.firstContainer}>
          <View style={styles.oneD}>
            <Text style={styles.text}>PORT OF DISCHARGE</Text>
            <Text style={styles.blueText}>{data?.portOfDischarge}</Text>
          </View>
          <View style={styles.twoD}>
            <Text style={styles.text}>PLACE OF DELIVERY</Text>
            <Text style={styles.blueText}>{data?.placeOfDelivery}</Text>
          </View>
          <View style={styles.threeD}>
            <Text style={styles.text}>TYPE OF MOVE</Text>
            <Text style={styles.blueText}>{data?.typeOfMove}</Text>
          </View>
          <View style={styles.fourD}>
            <Text style={styles.text}>CONTAINERIZED</Text>
            <View style={styles.checkboxContainer}>
          <View style={styles.checkbox}>
            <View style={styles.checkmark}></View>
          </View>
          <View style={styles.uncheckmark}>
            
          </View>
        </View>
          </View>
        </View>
        <View style={styles.fouthContainer}>
          <View style={styles.cargoHeader}>
            <View style={styles.cOne}>
              <Text style={styles.text}>MARK AND NUMBERS</Text>
            </View>
            <View style={styles.ctwo}>
              <Text style={styles.text}>NUMBER OF PACKAGES</Text>
            </View>
            <View style={styles.cthree}>
              <Text style={styles.text}>DESCRIPTION OF COMMODITIES IN</Text>
              <Text style={styles.text}>Schedule B detail</Text>
            </View>
            <View style={styles.cfour}>
              <Text style={styles.text}>GROSS WEIGHT</Text>
              <Text style={styles.text}>(Kilos)</Text>
            </View>
            <View style={styles.cfive}>
              <Text style={styles.text}>MESUREMENT</Text>
              <Text style={styles.text}>(CBM)</Text>
            </View>
          </View>
          <View style={styles.vCargoDiv}>
            {fieldArr.map(item => {
              return (
                <View style={styles.cargoHeader}>
                  <View style={styles.vOne}>
                    <Text style={styles.blueText}>{item.marksAndNumbers}</Text>
                  </View>
                  <View style={styles.typeDiv}>
                  {item.containerText && <View style={styles.packdiv}>
                  <Text style={styles.blueText}>{item.containerText} x </Text>
                  <Text style={styles.blueText}>{item.containerType}</Text>
                  </View>}
                  {item.cargoText && <View style={styles.packdiv}>
                  <Text style={styles.blueText}>{item.cargoText} x </Text>
                  <Text style={styles.blueText}>{item.cargoType}</Text>
                  </View>}
                  </View>
                 <View style={styles.vthree}>
                     <Text style={styles.blueText}>{item.description}</Text>
                 </View>
                 <View style={styles.vfour}>
                     <Text style={styles.blueText}>{item.grossWeight}</Text>
                 </View>
                 <View style={styles.vfive}>
                     <Text style={styles.blueText}>{item.measurement}</Text>
                 </View>
              </View>
              )
             })}
             <View style={styles.cargoHeader}>
                  <View style={styles.vOne}>
                    <Text style={styles.text}></Text>
                  </View>
                  <View style={styles.typeDiv}>
                  </View>
                 <View style={styles.desThree}>
                 <Text style={styles.text}>SHIPPER’S LOAD, STOW AND COUNT</Text>
                     <Text style={styles.text}>(Conditions of Carriage Also Available @ www.allworldshipping.com)</Text>
                 </View>
                 <View style={styles.vfour}>
                 </View>
                 <View style={styles.vfive}>
                     <Text style={styles.text}></Text>
                 </View>
              </View>
          </View>
        </View>
        <View style={styles.fifthContainer}>
          <Text style={styles.smText}>
            Carrier has a policy against payment, solicitation, of receipt of
            any rebate, directy or indirectly, which would be unlawful under the
            United States Shipping Act, 1984 as amended.
          </Text>
          <View style={styles.declaredValue}>
            <Text style={styles.text}>DECLARED VALUE</Text>
            <Text style={styles.dotted}>{data?.declaredValue}</Text>
            <Text style={styles.text}>
              READ CLAUSE 29 HEREOF CONCERNING EXTRA FREIGHT AND CARRIER'S
              LIMITATIONS OF LIABILITY.
            </Text>
          </View>
        </View>
        <View style={styles.sixthContainer}>
          <View style={styles.rateDiv}>
            <View style={styles.freightDiv}>
              <Text style={styles.text}>
                FREIGHT RATES, WEIGHTS AND/OR MEASUREMENTS
              </Text>
            </View>
            <View style={styles.caldiv}>
              <View style={styles.subjdiv}>
                <Text style={styles.text}>SUBJECT TO CORRECTION</Text>
              </View>
              <View style={styles.prepaiddiv}>
                <Text style={styles.text}>PREPAID</Text>
              </View>
              <View style={styles.collectdiv}>
                <Text style={styles.text}>COLLECT</Text>
              </View>
            </View>
            <View>
              {correction.map((item) => {
                return <View style={styles.vcalDiv}>
              <View style={styles.vsubjdiv}>
                <Text style={styles.blueText}>{item.subjectionCorrection}</Text>
              </View>
              <View style={styles.vprepaiddiv}>
                <Text style={styles.blueText}>{item.prepaid}</Text>
              </View>
              <View style={styles.vcollectdiv}>
                <Text style={styles.blueText}>{item.collect}</Text>
              </View>
            </View>
              })}
            </View>
            <View style={styles.caldiv}>
              <View style={styles.totaldiv}>
                <Text style={styles.text}>FORM-OCEHBL01</Text>
                <Text style={styles.text}>GRAND TOTAL</Text>
              </View>
              <View style={styles.totalsum}>
              <Text style={styles.blueText}>USD</Text>
                <Text style={styles.blueText}>{data?.prepaidtotal}</Text>
                </View>
              <View style={styles.totalcollect}>
              <Text style={styles.blueText}>USD</Text>
                <Text style={styles.blueText}>{data?.collecttotal}</Text>
                </View>
            </View>
          </View>
          <View style={styles.bottomRight}>
            <View style={styles.textContainer}>
              <Text style={styles.smText}>
                Received by Carrier for shipment ocean vessel between port of
                loading and port of discharge, and for arrangement or
                procurement of pre-carriage from place of receipt and
                on-carriage to place of delivery, where stated above, the good
                as specified above in apparent good order and condition unless
                otherwise stated. The goods to be delivered at the above
                mentioned port of discharge or place of delivery, whichever is
                applicable, subject always to the exceptions, limitations,
                conditions and liberties set out on the reverse side hereof, to
                which the Shipper and/or Consignee agree to accepting this Bill
                of Lading. IN WITNESS WHEREOF three (3) original Bills of lading
                have been signed, not otherwise stated above, one of which being
                accomplished the others shall be void.
              </Text>
            </View>
            <View style={styles.issuedDiv}>
              <Text style={styles.text}>Issued At</Text>
              <Text style={styles.underlingText}>{data?.issuedAt}</Text>
            </View>
            <View style={styles.issuedDiv}>
              <Text style={styles.text}>By</Text>
              <Text style={styles.bunderlingText}>{data?.issuedBy}</Text>
            </View>
            <View style={styles.centerText}>
              <Text style={styles.text}>AGENT FOR THE CARRIER</Text>
            </View>
            <View style={styles.dateContainer}>
              <View style={styles.dateDiv}>
                <Text style={styles.oneDate}>MONTH</Text>
                <Text style={styles.twoDate}>DAY</Text>
                <Text style={styles.threeDate}>YEAR</Text>
              </View>
              <View style={styles.dateDiv}>
                <Text style={styles.oneDate}>
                  {moment(data.blDate, "YYYY-MM-DD").format("MMM") ?? ""}
                </Text>
                <Text style={styles.twoDate}>
                  {moment(data.blDate, "YYYY-MM-DD").format("DD") ?? ""}
                </Text>
                <Text style={styles.threeDate}>
                  {moment(data.blDate, "YYYY-MM-DD").format("YYYY") ?? ""}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
