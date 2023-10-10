import * as yup from "yup";
import moment from "moment";

const validationSchema = yup.object({
    documentNo: yup.string().required("Please input a valid Document Number"),
    destinationAgent: yup
      .string()
      .required("Please input a valid Destination Agent."),
    oceanCarrier: yup.string().required("Please select a valid Ocean Carrier."),
    source: yup.string().required("Please select a valid Source."),
    portOfLoading: yup.string().required("Please select Port of Loading."),
    portOfDischarge: yup.string().required("Please select Port of Discharge."),
    blDate: yup.string().required("Please slect the bl Date.").transform,
    declaredValue: yup
      .string()
      .typeError("Please input the valid declared value")
      .required("Please input a valid Declared Value").test("declaredValue", "Enter only numbers", function (value) {
        if (value) {
          const numberRegex = /^[+]?\d+(\.\d{1,4})?$/;
          if (!numberRegex.test(value)) {
            return false;
          }
        }
        return true;
      }),
    blDate: yup
      .string()
      .required("Please input the blDate")
      .transform((value) =>
        value !== null ? moment(value).format("YYYY-DD-MM") : value
      ),
    cargoItems: yup.array().of(
      yup.object({
        grossWeight: yup
          .string().required("Please Enter gross weight")
          .matches(/^[+]?\d+(\.\d{1,4})?$/, "Invalid gross weight"),
        measurement: yup
          .string().required("Please Enter measurement")
          .matches(/^[+]?\d+(\.\d{1,4})?$/, "Invalid measurement"),
        description: yup
          .string()
          .required("Please input the description of commadity"),
        marksAndNumbers: yup
          .string()
          .test("marksAndNumbers", "Enter Marks & No", function (value) {
            const index = this.path.split(".")[0].charAt(11);
            if (this.options.context.marksType === "multi") {
              if (!value) {
                return false;
              }
            } else {
              if (
                this.options.context.marksType === "single" &&
                parseInt(index) === 0
              ) {
                if (!value) {
                  return false;
                }
              }
            }
            return true;
          }),
        cargoText: yup
          .string()
          .test("cargoText", "Enter Cargo No", function (value) {
            if (this.options.context.shipmentType === "lcl") {
              if (!value) {
                return false;
              }
            }
            return true;
          }),
        cargoType: yup
          .string()
          .test("cargoType", "Select Cargo Type", function (value) {
            if (this.options.context.shipmentType === "lcl") {
              if (!value) {
                return false;
              }
            }
            return true;
          }),
        containerText: yup
          .string()
          .test("containerText", "Enter Container No", function (value) {
            if (this.options.context.shipmentType === "fcl") {
              if (!value) {
                return false;
              }
            }
            return true;
          }),
        containerType: yup
          .string()
          .test("containerType", "Select Container type", function (value) {
            if (this.options.context.shipmentType === "fcl") {
              if (!value) {
                return false;
              }
            }
            return true;
          }),
      })
    ),
    correction: yup.array().of(
      yup.object().shape({
        subjectionCorrection: yup
          .string()
          .typeError("Please input the valid prepaid")
          .test(
            "subjectionCorrection",
            "Enter Subjection Correction",
            function (value) {
              if (this.parent.collect || this.parent.prepaid) {
                if (!this.parent.subjectionCorrection) {
                  return false;
                }
              }
              return true;
            }
          ),
        prepaid: yup
          .string()
          .typeError("Please input the valid prepaid")
          .test("subjectionCorrection", "Please Enter prepaid", function (value) {
            if (this.parent.collect || this.parent.subjectionCorrection) {
              if (!this.parent.prepaid) {
                return false;
              }
            }
            return true;
          }).test("PrepaidValue", "Please Enter only numbers", function (value) {
            if (value) {
              const numberRegex = /^[+]?\d+(\.\d{1,4})?$/;
              if (!numberRegex.test(value)) {
                return false;
              }
            }
            return true;
          }),
        collect: yup
          .string()
          .typeError("Please input the valid prepaid")
          .test("subjectionCorrection", "Please Enter collect", function (value) {
            if (this.parent.subjectionCorrection || this.parent.prepaid) {
              if (!this.parent.collect) {
                return false;
              }
            }
            return true;
          }).test("collect", "Please Enter only numbers", function (value) {
            if (value) {
              const numberRegex = /^[+]?\d+(\.\d{1,4})?$/;
              if (!numberRegex.test(value)) {
                return false;
              }
            }
            return true;
          }),
      })
    )
  });


  export {
    validationSchema
  }

