document.addEventListener('DOMContentLoaded', function() {
    const messengerForm = document.getElementById('messengerForm');
    const messengerList = document.getElementById('messengerList');

    messengerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const nombre = document.getElementById('nombre').value;
        const telefono = document.getElementById('telefono').value;

        if (nombre && telefono) {
            const messengerItem = document.createElement('li');
            messengerItem.textContent = `Nombre: ${nombre}, Teléfono: ${telefono}`;

            messengerList.appendChild(messengerItem);

            // Aquí podrías agregar la lógica para enviar los datos al backend y guardarlos en una base de datos.
            
            // Limpia el formulario
            messengerForm.reset();
        }
    });
});
