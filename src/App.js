import React, { useState } from "react";
import "./app.scss";
import * as XLSX from "xlsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductCard from "./components/ProductCard";
import useLocalStorage from "./hooks/useLocalStorage";
const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useLocalStorage("items", []);
  const [value, setValue] = useLocalStorage("value", 0);
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [certificate, setCertificate] = useState([]);

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      let isFile = true;
      for (let i = 0; i < d.length; i++) {
        if (
          !d[i].ARcode ||
          !d[i].Analysis_start ||
          !d[i].EHC_code ||
          !d[i].EUVNHC_code ||
          !d[i].Max_validationDate ||
          !d[i].PARAMETER_EN_NAME ||
          !d[i]["PASS/FAIL"] ||
          !d[i].TATstartdate ||
          !d[i].parametercode ||
          !d[i].samplePartnerCode ||
          !d[i].samplename ||
          !d[i].testcode ||
          !d[i].testname ||
          !d[i].trialnumber ||
          !d[i].unit ||
          (!d[i].numericalValue && d[i].numericalValue !== 0)
        ) {
          isFile = false;
          i = d.length;
        }
      }
      if (!isFile) {
        toast.error("Tệp không đúng định dạng");
      } else {
        setItems(d);
      }
    });
  };

  const handleCertificate = () => {
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].info) {
          certificate.push({
            nameProduct: items[i].samplename
              .split(",")[1]
              .trim()
              .replace(/  +/g, " "),
            lot: items[i].samplename.split(",")[0].trim().replace(/  +/g, " "),
          });
        }
      }
    }
  };

  let qty;
  const handleOnSave = () => {
    handleCertificate();
    items &&
      certificate[0].nameProduct &&
      certificate.unshift({
        nameProduct: "",
        lot: "Cont/Seal",
      });
    qty = [];

    let temp = 1;
    let cout = 1;
    const passName = "PASS/FAIL";
    for (let i = 0; i < items.length; i++) {
      if (items[i].cont) {
        for (let j = 0; j < items[i].cont.length; j++) {
          let str = `CONT_${temp}`;
          if (
            !Object.values(certificate[0]).find(
              (item) => item === items[i].cont[j] + "/" + items[i].seal[j]
            )
          ) {
            certificate[0] = {
              ...certificate[0],
              [str]: items[i].cont[j] + "/" + items[i].seal[j],
            };

            temp++;
          }
          if (qty.length === 0) {
            qty.push({
              [`CONT_${cout}`]: items[i].cont[j] + "/" + items[i].seal[j],

              name: items[i].samplename
                .split(",")[1]
                .trim()
                .replace(/  +/g, " "),
              EHC_code: items[i].EHC_code,
              contNumber: items[i].cont[j],
              sealNumber: items[i].seal[j],
              EUVNHC_code: items[i].EUVNHC_code,
              samplePartnerCode: items[i].samplePartnerCode,
              ARcode: items[i].ARcode,
              samplename: items[i].samplename,
              TATstartdate: items[i].TATstartdate,
              trialnumber: items[i].trialnumber,
              Analysis_start: items[i].Analysis_start,
              testcode: items[i].testcode,
              testname: items[i].testname,
              Max_validationDate: items[i].Max_validationDate,
              parametercode: items[i].parametercode,
              PARAMETER_EN_NAME: items[i].PARAMETER_EN_NAME,
              numericalValue: items[i].numericalValue,
              unit: items[i].unit,
              [passName]: items[i]["PASS/FAIL"],
              boxNumber: items[i].info[j].boxNumber,
              packageNumber: items[i].info[j].packageNumber,
              netWeight: items[i].info[j].netWeight,
              grossWeight: items[i].info[j].grossWeight,
            });
            cout++;
          } else if (qty.length > 0) {
            for (let t = 0; t < qty.length; t++) {
              if (
                Object.values(qty[t])[0] ===
                items[i].cont[j] + "/" + items[i].seal[j]
              ) {
                qty.push({
                  [Object.keys(qty[t])[0]]:
                    items[i].cont[j] + "/" + items[i].seal[j],
                  name: items[i].samplename
                    .split(",")[1]
                    .trim()
                    .replace(/  +/g, " "),
                  EHC_code: items[i].EHC_code,
                  contNumber: items[i].cont[j],
                  sealNumber: items[i].seal[j],
                  EUVNHC_code: items[i].EUVNHC_code,
                  samplePartnerCode: items[i].samplePartnerCode,
                  ARcode: items[i].ARcode,
                  samplename: items[i].samplename,
                  TATstartdate: items[i].TATstartdate,
                  trialnumber: items[i].trialnumber,
                  Analysis_start: items[i].Analysis_start,
                  testcode: items[i].testcode,
                  testname: items[i].testname,
                  Max_validationDate: items[i].Max_validationDate,
                  parametercode: items[i].parametercode,
                  PARAMETER_EN_NAME: items[i].PARAMETER_EN_NAME,
                  numericalValue: items[i].numericalValue,
                  unit: items[i].unit,
                  [passName]: items[i]["PASS/FAIL"],
                  boxNumber: items[i].info[j].boxNumber,
                  packageNumber: items[i].info[j].packageNumber,
                  netWeight: items[i].info[j].netWeight,
                  grossWeight: items[i].info[j].grossWeight,
                });
                t = qty.length;
              } else if (t === qty.length - 1) {
                qty.push({
                  [`CONT_${cout}`]: items[i].cont[j] + "/" + items[i].seal[j],
                  name: items[i].samplename
                    .split(",")[1]
                    .trim()
                    .replace(/  +/g, " "),
                  EHC_code: items[i].EHC_code,
                  contNumber: items[i].cont[j],
                  sealNumber: items[i].seal[j],
                  EUVNHC_code: items[i].EUVNHC_code,
                  samplePartnerCode: items[i].samplePartnerCode,
                  ARcode: items[i].ARcode,
                  samplename: items[i].samplename,
                  TATstartdate: items[i].TATstartdate,
                  trialnumber: items[i].trialnumber,
                  Analysis_start: items[i].Analysis_start,
                  testcode: items[i].testcode,
                  testname: items[i].testname,
                  Max_validationDate: items[i].Max_validationDate,
                  parametercode: items[i].parametercode,
                  PARAMETER_EN_NAME: items[i].PARAMETER_EN_NAME,
                  numericalValue: items[i].numericalValue,
                  unit: items[i].unit,
                  [passName]: items[i]["PASS/FAIL"],
                  boxNumber: items[i].info[j].boxNumber,
                  packageNumber: items[i].info[j].packageNumber,
                  netWeight: items[i].info[j].netWeight,
                  grossWeight: items[i].info[j].grossWeight,
                });
                cout++;
                t = qty.length;
              }
            }
          }
        }
      }
    }

    if (items.find((item) => item.cont)) {
      for (let j = 1; j < certificate.length; j++) {
        for (let index = 0; index < qty.length; index++) {
          for (let t = 0; t < Object.keys(certificate[0]).length - 2; t++) {
            if (
              qty[index].name === certificate[j].nameProduct &&
              `CONT_${t + 1}` === Object.keys(qty[index])[0]
            ) {
              certificate[j] = {
                ...certificate[j],
                [`CONT_${t + 1}`]: qty[index].boxNumber,
              };
            }
          }
        }
      }
    }
    for (let q = 0; q < qty.length; q++) {
      data2.push({
        EHC_code: qty[q].EHC_code,
        Ma_chung_thu:
          qty[q].EHC_code + "-" + Object.keys(qty[q])[0].split("_")[1],
        cont_number: qty[q].contNumber,
        seal_number: qty[q].sealNumber,
        EUVNHC_code: qty[q].EUVNHC_code,
        samplePartnerCode: qty[q].samplePartnerCode,
        ARcode: qty[q].ARcode,
        samplename: qty[q].samplename,
        TATstartdate: qty[q].TATstartdate,
        trialnumber: qty[q].trialnumber,
        Analysis_start: qty[q].Analysis_start,
        testcode: qty[q].testcode,
        testname: qty[q].testname,
        Max_validationDate: qty[q].Max_validationDate,
        parametercode: qty[q].parametercode,
        PARAMETER_EN_NAME: qty[q].PARAMETER_EN_NAME,
        numericalValue: qty[q].numericalValue,
        unit: qty[q].unit,
        [passName]: qty[q]["PASS/FAIL"],
        box_number: qty[q].boxNumber,
        package_number: qty[q].packageNumber,
        net_weigth: qty[q].netWeight,
        gross_weight: qty[q].grossWeight,
      });
    }
    temp = 1;
    for (let i = 0; i < items.length; i++) {
      if (items[i].info) {
        data1.push({
          EHC_code: items[i].EHC_code,
          samplePartnerCode: items[i].samplePartnerCode,
          ARcode: items[i].ARcode,
          samplename: items[i].samplename,
          TATstartdate: items[i].TATstartdate,
          Analysis_start: items[i].Analysis_start,
          testcode: items[i].testcode,
          testname: items[i].testname,
          Max_validationDate: items[i].Max_validationDate,
          parametercode: items[i].parametercode,
          PARAMETER_EN_NAME: items[i].PARAMETER_EN_NAME,
          numericalValue: items[i].numericalValue,
          unit: items[i].unit,
          [passName]: items[i]["PASS/FAIL"],
          contNumber: items[i].info.map((item) => item.contNumber).join(", "),
        });
      }
    }
  };

  const downloadExcel = async () => {
    handleOnSave();
    const wb = XLSX.utils.book_new();

    const workData = XLSX.utils.json_to_sheet(data1);
    XLSX.utils.book_append_sheet(wb, workData, "Data1");
    const workCertificate = XLSX.utils.json_to_sheet(certificate);
    XLSX.utils.book_append_sheet(wb, workCertificate, "Certificate");
    const workData2 = XLSX.utils.json_to_sheet(data2);
    XLSX.utils.book_append_sheet(wb, workData2, "Data2");
    for (let i = 0; i < Object.keys(certificate[0]).length - 2; i++) {
      const workCerti = XLSX.utils.json_to_sheet(
        // eslint-disable-next-line eqeqeq
        data2.filter((item) => item.Ma_chung_thu.slice(-1) == i + 1)
      );
      XLSX.utils.book_append_sheet(wb, workCerti, `Certificate_${i + 1}`);
    }
    //Buffer
    //let buf = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
    //Binary string
    XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    //Download
    XLSX.writeFile(wb, "Data1.xlsx");
    setItems([]);
    setCertificate([]);
    setData1([]);
    setData2([]);
  };

  console.log("items", items);

  return (
    <>
      {!showModal && (
        <div className={`table__container`}>
          {items && items.length > 0 ? (
            <div className="pd-2">
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>Mã số cont</th>
                    <th>Mã số seal</th>
                    <th>Số thùng</th>
                    <th>Số packages</th>
                    <th>Net Weight</th>
                    <th>Gross Weight</th>
                    <th>EHC_code</th>
                    <th>EUVNHC_code</th>
                    <th>samplePartnerCode</th>
                    <th>ARcode</th>
                    <th>samplename</th>
                    <th>TATstartdate</th>
                    <th>Analysis_start</th>
                    <th>testcode</th>
                    <th>testname</th>
                    <th>Max_validationDate</th>
                    <th>parametercode</th>
                    <th>PARAMETER_EN_NAME</th>
                    <th>numericalValue</th>
                    <th>unit</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr
                      key={index}
                      className={`${
                        item["PASS/FAIL"] === "PASS" ? "" : "error"
                      } ${
                        item.info &&
                        item.info[0].contNumber &&
                        item.info[0].sealNumber &&
                        item.info[0].boxNumber &&
                        item.info[0].packageNumber &&
                        item.info[0].netWeight &&
                        item.info[0].grossWeight
                          ? "success"
                          : ""
                      }`}
                    >
                      <td>
                        {item["PASS/FAIL"] === "PASS" && (
                          <button
                            className={`btn-add ${
                              item.info &&
                              item.info[0].contNumber &&
                              item.info[0].sealNumber &&
                              item.info[0].boxNumber &&
                              item.info[0].packageNumber &&
                              item.info[0].netWeight &&
                              item.info[0].grossWeight
                                ? "text-success"
                                : ""
                            }`}
                            onClick={() => {
                              setShowModal(true);
                              setValue(index);
                            }}
                          >
                            <span>
                              &nbsp;
                              {item.info &&
                              item.info[0].contNumber &&
                              item.info[0].sealNumber &&
                              item.info[0].boxNumber &&
                              item.info[0].packageNumber &&
                              item.info[0].netWeight &&
                              item.info[0].grossWeight
                                ? "Sửa thông tin"
                                : "Thêm thông tin"}
                              &nbsp;
                            </span>
                            <span className="hover-text">
                              &nbsp;
                              {item.info &&
                              item.info[0].contNumber &&
                              item.info[0].sealNumber &&
                              item.info[0].boxNumber &&
                              item.info[0].packageNumber &&
                              item.info[0].netWeight &&
                              item.info[0].grossWeight
                                ? "Sửa thông tin"
                                : "Thêm thông tin"}
                              &nbsp;
                            </span>
                          </button>
                        )}
                      </td>
                      <td>
                        {item.info &&
                          item.info.map((item) => item.contNumber).join(", ")}
                      </td>
                      <td>
                        {item.info &&
                          item.info.map((item) => item.sealNumber).join(", ")}
                      </td>
                      <td>
                        {item.info &&
                          item.info.map((item) => item.boxNumber).join(", ")}
                      </td>
                      <td>
                        {item.info &&
                          item.info
                            .map((item) => item.packageNumber)
                            .join(", ")}
                      </td>
                      <td>
                        {item.info &&
                          item.info.map((item) => item.netWeight).join(", ")}
                      </td>
                      <td>
                        {item.info &&
                          item.info.map((item) => item.grossWeight).join(", ")}
                      </td>
                      <td>{item.EHC_code}</td>
                      <td>{item.EUVNHC_code}</td>
                      <td>{item.samplePartnerCode}</td>
                      <td>{item.ARcode}</td>
                      <td>{item.samplename}</td>
                      <td>{excelDateToJSDate(item.TATstartdate)}</td>
                      <td>{excelDateToJSDate(item.Analysis_start)}</td>
                      <td>{item.testcode}</td>
                      <td>{item.testname}</td>
                      <td>{excelDateToJSDate(item.Max_validationDate)}</td>
                      <td>{item.parametercode}</td>
                      <td>{item.PARAMETER_EN_NAME}</td>
                      <td>{item.numericalValue}</td>
                      <td>{item.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <>
              <input
                className="file-input"
                type="file"
                id="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  readExcel(file);
                }}
              />
              <label className="input-file" htmlFor="file">
                Chọn tệp
              </label>
            </>
          )}
        </div>
      )}

      {showModal && (
        <ProductCard
          value={value}
          onClose={() => setShowModal(false)}
          items={items}
          setItems={setItems}
        />
      )}

      {items &&
        items.length > 0 &&
        items
          .filter((item) => item["PASS/FAIL"] === "PASS")
          .every((item) => item.info) && (
          <button className="btn-download" onClick={downloadExcel}>
            Download
          </button>
        )}

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default App;

function excelDateToJSDate(excelDate) {
  var date = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
  var converted_date = date.toISOString().split("T")[0];
  return converted_date;
}
