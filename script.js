document.addEventListener('DOMContentLoaded', function() {
    const messengerForm = document.getElementById('messengerForm');
    const messengerBody = document.getElementById('messengerBody');

    messengerForm.addEventListener('submit', function(event) {
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
            const row = messengerBody.insertRow();

            const cell1 = row.insertCell(0);
            cell1.textContent = nombre;

            const cell2 = row.insertCell(1);
            cell2.textContent = documento;

            const cell3 = row.insertCell(2);
            cell3.textContent = telefono;

            const cell4 = row.insertCell(3);
            cell4.textContent = edad;

            const cell5 = row.insertCell(4);
            cell5.textContent = veh;

            // Nueva columna de acciones
            const cell6 = row.insertCell(5);
            
            // Botón Eliminar
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.addEventListener('click', function() {
                // Aquí puedes agregar la lógica para eliminar la fila
                row.remove();
            });
            cell6.appendChild(deleteButton);
            
            // Botón Editar
            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.addEventListener('click', function() {
                // Aquí puedes agregar la lógica para editar la fila
                // Por ejemplo, llenar el formulario con los datos de la fila seleccionada para su edición.
            });
            cell6.appendChild(editButton);
            
            // Botón Ver
            const viewButton = document.createElement('button');
            viewButton.textContent = 'Ver';
            viewButton.addEventListener('click', function() {
                // Aquí puedes agregar la lógica para ver los detalles de la fila
                // Por ejemplo, mostrar una ventana emergente con la información de la fila.
            });
            cell6.appendChild(viewButton);

            // Aquí podrías agregar la lógica para enviar los datos al backend y guardarlos en una base de datos.
            
            // Limpia el formulario
            messengerForm.reset();
        }
    });
});
