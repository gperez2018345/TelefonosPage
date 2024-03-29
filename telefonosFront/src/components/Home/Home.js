import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Tabla } from "../Tabla/Tabla";
import { TablaUsuario } from "../Tabla/TablaUsuario";
import { Link, useNavigate } from "react-router-dom";
import "./home.css";
import Swal from "sweetalert2";
import { DataContext } from '../../context/DataContext';

export const Home = () => {

  const { data, setData } = useContext(DataContext);
  const [horaIn, setHoraIn] = useState("");
  const [horaOut, setHoraOut] = useState("");
  const [idUs, setIdUs] = useState("");
  const [rec, setRec] = useState(false);
  const [res, setRes] = useState(false);

  const [valores, setValores] = useState({
    numero: "",
    descripcion: "",
    solucion: "",
    horaInicio: "",
    horaFin: "",
    tipo: "",
    finalizada: "",
    idUsuario: localStorage.getItem("id"),
    jornada: ""
  });

  const { numero, descripcion, solucion, tipo, finalizada } = valores;

  useEffect(() => {
    if (localStorage.getItem('id') == undefined || localStorage.getItem('id') == null) {
      useNavigate('/')
    }
  }, []);

  function horaInicioCall() {
    setValores({ ...valores, horaInicio: new Date().toLocaleTimeString() });
  }

  const guardarCall = () => {
    axios
      .post("http://localhost:3000/api/guardarLlamada", valores, { headers: { Authorization: localStorage.getItem('token') } })
      .then((response) => {
        setRes(!res)
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function entrada() {
    let obj = { horaEntrada: horaIn };
    setData(1)
    axios
      .put(
        `http://localhost:3000/api/horaEntrada/${localStorage.getItem("id")}`,
        obj, { headers: { Authorization: localStorage.getItem('token') } }
      )
      .then(({ response }) => {
        setRec(!rec)
        Swal.fire({ icon: "success", text: "Hora de entrada marcada" }).then(
          () => { }
        );
        console.log(response.data);

      })
      .catch((error) => {
        console.log(error);
      });
  }

  function salida() {
    let obj = { horaSalida: horaOut };

    axios
      .put(
        `http://localhost:3000/api/horaSalida/${localStorage.getItem("id")}`,
        obj, { headers: { Authorization: localStorage.getItem('token') } }
      )
      .then((response) => {
        setRec(!rec)
        Swal.fire({ icon: "success", text: "Hora de salida marcada" }).then(
          () => { }
        );
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }


  return (
    <>
      <section className="jornada">
        <div className="botones-entrada">
          {data == 0 ? (<button
            type="button"
            className="btn btn-light"
            onClick={() => {
              setHoraIn(new Date().toLocaleTimeString());
              entrada();
              localStorage.setItem('valor', 1);
              setData(localStorage.getItem('valor'));
            }}
          >
            Entrada
          </button>) : null}
          {data == 1 ? (
            <>

              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  setHoraOut(new Date().toLocaleTimeString());
                  salida();
                  localStorage.setItem('valor', 0);
                  setData(localStorage.getItem('valor'))
                }}
              >
                Salida
              </button>

            </>
          ) : null}


        </div>

        <div>
          <TablaUsuario rec={rec} id={idUs} />
        </div>
        <div className="bt">

          {data == 1 ? (
            <>
              <button
                type="button"
                className="btn btn-danger"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={horaInicioCall}
              >
                Iniciar una nueva llamada
              </button>
            </>
          ) : null}



        </div>
      </section>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Llamada
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input
                name="numero"
                type="Number"
                placeholder="Número T."
                className="form-control"
                onChange={(e) => {
                  setValores({ ...valores, numero: e.target.value });
                }}
                value={numero}
              />
            </div>
            <div className="modal-body">
              <input
                name="descripcion"
                type="Text"
                placeholder="Descripción"
                className="form-control"
                onChange={(e) => {
                  setValores({ ...valores, descripcion: e.target.value });
                }}
                value={descripcion}
              />
            </div>
            <div className="modal-body">
              <input
                name="solucion"
                type="Text"
                placeholder="Solución"
                className="form-control"
                onChange={(e) => {
                  setValores({ ...valores, solucion: e.target.value });
                }}
                value={solucion}
              />
            </div>
            <div className="modal-body">
              <select
                type="text"
                className="form-select"
                onChange={(e) => {
                  setValores({ ...valores, tipo: e.target.value });
                }}
                value={tipo}
              >
                <option>Tipo</option>
                <option value="Venta Nueva">Venta Nueva</option>
                <option value="Venta por renovación">
                  Venta por renovación
                </option>
                <option value="Venta no completada">Venta no completada</option>
                <option value="Venta no cumple el requisito">
                  Venta no cumple el requisito
                </option>
              </select>
            </div>

            <div className="modal-body">
              <select
                type="text"
                className="form-select"
                onChange={(e) => {
                  setValores({ ...valores, finalizada: e.target.value });
                }}
                value={finalizada}
              >
                <option>Finalizada</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                onClick={guardarCall}
                data-bs-dismiss="modal"
              >
                Guardar Llamada
              </button>
            </div>
          </div>
        </div>
      </div>

      <Tabla res={res} id={idUs} />
    </>
  );
};
