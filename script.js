let listaMensajeros = [];

const objMensajero = {
    nombre: '',
    documento: '',
    telefono: '',
    edad: '',
    vehiculo: ''
}

let editando = false;

document.addEventListener('DOMContentLoaded', function () {
    const messengerForm = document.querySelector('#messengerForm');
    const nombreInput = document.querySelector('#nombre');
    const docInput = document.querySelector('#doc');
    const telefonoInput = document.querySelector('#telefono');
    const edadInput = document.querySelector('#edad');
    const vehRadioButtons = document.getElementsByName('tipo_veh');

    const agregarButton = document.querySelector('button[type="submit"]');

    const messengerBody = document.querySelector('#messengerBody');

    messengerForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const nombre = nombreInput.value;
        const documento = docInput.value;
        const telefono = telefonoInput.value;
        const edad = edadInput.value;

        let vehiculo = '';
        for (let i = 0; i < vehRadioButtons.length; i++) {
            if (vehRadioButtons[i].checked) {
                vehiculo = vehRadioButtons[i].value;
                break;
            }
        }

        if (nombre && telefono && vehiculo) {
            if (editando) {
                editarMensajero();
                editando = false;
            } else {
                agregarMensajero(nombre, documento, telefono, edad, vehiculo);
            }

            messengerForm.reset();
        }
    });

    function agregarMensajero(nombre, documento, telefono, edad, vehiculo) {
        const mensajeroExistente = listaMensajeros.find((mensajero) => mensajero.documento === documento);
        if (mensajeroExistente) {
            alert('Ya existe un mensajero con el mismo documento. No se puede agregar.');
            return;
        }
        const nuevoMensajero = { nombre, documento, telefono, edad, vehiculo };
        listaMensajeros.push(nuevoMensajero);
        mostrarMensajeros();
        messengerForm.reset();
        limpiarObjeto();
    }

    function mostrarMensajeros() {
        messengerBody.innerHTML = '';

        listaMensajeros.forEach((mensajero) => {
            const row = messengerBody.insertRow();

            const cell1 = row.insertCell(0);
            cell1.textContent = mensajero.nombre;

            const cell2 = row.insertCell(1);
            cell2.textContent = mensajero.documento;

            const cell3 = row.insertCell(2);
            cell3.textContent = mensajero.telefono;

            const cell4 = row.insertCell(3);
            cell4.textContent = mensajero.edad;

            const cell5 = row.insertCell(4);
            cell5.textContent = mensajero.vehiculo;

            const cell6 = row.insertCell(5);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.style.backgroundColor = '#E74C3C';
            deleteButton.classList.add('btn', 'btn-delete');
            deleteButton.addEventListener('click', function () {
                eliminarMensajero(mensajero.documento);
            });
            cell6.appendChild(deleteButton);

            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.style.backgroundColor = '#4CAF50';
            editButton.classList.add('btn', 'btn-edit');
            editButton.addEventListener('click', function () {
                agregarButton.textContent = "Actualizar";
                agregarButton.style.backgroundColor = "#4CAF50";
                editando = true;
                cargarMensajero(mensajero);
            });
            cell6.appendChild(editButton);
        });
    }

    function cargarMensajero(mensajero) {
        nombreInput.value = mensajero.nombre;
        docInput.value = mensajero.documento;
        telefonoInput.value = mensajero.telefono;
        edadInput.value = mensajero.edad;
        
        for (let i = 0; i < vehRadioButtons.length; i++) {
            if (vehRadioButtons[i].value === mensajero.vehiculo) {
                vehRadioButtons[i].checked = true;
                break;
            }
        }

        objMensajero.documento = mensajero.documento;
        // Deshabilitar el campo de documento en modo de edición
        docInput.disabled = true;
    }

    function editarMensajero() {
        const documento = objMensajero.documento;
        const nombre = nombreInput.value;
        const telefono = telefonoInput.value;
        const edad = edadInput.value;

        let vehiculo = '';
        for (let i = 0; i < vehRadioButtons.length; i++) {
            if (vehRadioButtons[i].checked) {
                vehiculo = vehRadioButtons[i].value;
                break;
            }
        }

        listaMensajeros = listaMensajeros.map((mensajero) => {
            if (mensajero.documento === documento) {
                return {
                    nombre,
                    documento,
                    telefono,
                    edad,
                    vehiculo
                };
            }
            return mensajero;
        });

        mostrarMensajeros();

        messengerForm.reset();
        editando = false;

        agregarButton.textContent = "Agregar";
        agregarButton.style.backgroundColor = "#333";

        // Habilitar nuevamente el campo de documento después de la edición
        docInput.disabled = false;
    }

    function eliminarMensajero(documento) {
        listaMensajeros = listaMensajeros.filter((mensajero) => mensajero.documento !== documento);
        mostrarMensajeros();
    }

    mostrarMensajeros();
});
