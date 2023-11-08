let listaMensajeros = [];

const objMensajero = {
    id: "",
    nombre: '',
    documento: '',
    telefono: '',
    edad: "",
    vehiculo: ''
}

let editando = false;

document.addEventListener('DOMContentLoaded', function () {
    const messengerForm = document.getElementById('messengerForm');
    const messengerBody = document.getElementById('messengerBody');

    messengerForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const documento = document.getElementById('doc').value;
        const telefono = document.getElementById('telefono').value;
        const edad = document.getElementById('edad').value;

        const vehRadioButtons = document.getElementsByName('tipo_veh');
        let veh = ''; // Inicialmente no seleccionado
        for (let i = 0; i < vehRadioButtons.length; i++) {
            if (vehRadioButtons[i].checked) {
                veh = vehRadioButtons[i].value;
                break; // Termina el bucle si se encuentra un valor seleccionado
            }
        }

        if (nombre && telefono && veh) {
            if (editando) {
                editarMensajero();
                editando = false;
            } else {
                agregarMensajero(nombre, documento, telefono, edad, veh);
            }

            // Limpia el formulario
            messengerForm.reset();
        }
    });

    function agregarMensajero(nombre, documento, telefono, edad, vehiculo) {
        
        const mensajeroExistente = listaMensajeros.find((mensajero) => mensajero.documento === documento);
        
        if (mensajeroExistente) {
            alert('Ya existe un mensajero con el mismo documento. No se puede agregar.');
            return;
        }

        const mensajero = {
            nombre,
            documento,
            telefono,
            edad,
            vehiculo
        };

        listaMensajeros.push(mensajero);
        mostrarMensajeros();
    }

    function mostrarMensajeros() {
        // Limpia la tabla de mensajeros
        messengerBody.innerHTML = '';

        listaMensajeros.forEach((mensajero) => {
            const row = messengerBody.insertRow();
            row.dataset.id = mensajero.id;

            row.insertCell(0).textContent = mensajero.nombre;
            row.insertCell(1).textContent = mensajero.documento;
            row.insertCell(2).textContent = mensajero.telefono;
            row.insertCell(3).textContent = mensajero.edad;
            row.insertCell(4).textContent = mensajero.vehiculo;

            const cell5 = row.insertCell(5);

            // Botón Eliminar
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.style.backgroundColor="#E74C3C"
            deleteButton.classList.add('btn', 'btn-delete');
            deleteButton.addEventListener('click', function () {
                eliminarMensajero(mensajero.id);
            });
            cell5.appendChild(deleteButton);

            // Botón Editar
            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.style.backgroundColor = '#4CAF50';
            editButton.classList.add('btn', 'btn-edit');
            editButton.addEventListener('click', function () {

                const agregarButton = document.querySelector('button[type="submit"]');
                if (!editando) {
                    // Si no estás en modo de edición, cambia el botón Agregar a Actualizar y su color
                    agregarButton.textContent = "Actualizar";
                    agregarButton.style.backgroundColor = "#4CAF50"; // Color verde
                    editando = true;
                } else {
                    // Si ya estás en modo de edición, cambia el botón Agregar de vuelta a su estado original
                    agregarButton.textContent = "Agregar";
                    agregarButton.style.backgroundColor = "#333"; // Color original
                    editando = false;
                }
                cargarMensajero(mensajero);
            });
            cell5.appendChild(editButton);
        });
    }


    function cargarMensajero(mensajero) {
        document.getElementById('nombre').value = mensajero.nombre;
        document.getElementById('doc').value = mensajero.documento;
        
        document.getElementById('telefono').value = mensajero.telefono;
        document.getElementById('edad').value = mensajero.edad;

        const vehRadioButtons = document.getElementsByName('tipo_veh');
        for (let i = 0; i < vehRadioButtons.length; i++) {
            if (vehRadioButtons[i].value === mensajero.vehiculo) {
                vehRadioButtons[i].checked = true;
                break;
            }
        }

        objMensajero.id = mensajero.id;
    }

    function editarMensajero() {
        const id = objMensajero.id;
        const nombre = document.getElementById('nombre').value;
        const documento = document.getElementById('doc').value;
        const telefono = document.getElementById('telefono').value;
        const edad = document.getElementById('edad').value;

        const vehRadioButtons = document.getElementsByName('tipo_veh');
        let vehiculo = '';
        for (let i = 0; i < vehRadioButtons.length; i++) {
            if (vehRadioButtons[i].checked) {
                vehiculo = vehRadioButtons[i].value;
                break;
            }
        }

        listaMensajeros = listaMensajeros.map((mensajero) => {
            if (mensajero.id === id) {
                return {
                    id,
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

        // Limpia el formulario
        messengerForm.reset();
        editando = false;

        // Cambia el botón de "Agregar" de vuelta a su estado original
    const agregarButton = document.querySelector('button[type="submit"]');
    agregarButton.textContent = "Agregar";
    agregarButton.style.backgroundColor = "#333"; // Color original
    docInput.disabled = false;
    }

    function eliminarMensajero(id) {
        listaMensajeros = listaMensajeros.filter((mensajero) => mensajero.id !== id);
        mostrarMensajeros();
    }

    // Inicialmente, muestra la lista de mensajeros vacía
    mostrarMensajeros();
});
