import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuarioLista } from '../classes/usuarios-lista';
import { Usuario } from '../classes/usuario';


export const usuarioConetados = new UsuarioLista();

export const conectarCliente = ( cliente: Socket ) => {
    const usuario = new Usuario( cliente.id );
    usuarioConetados.agregar( usuario );
}

export const desconectar = ( cliente: Socket ) => {

    cliente.on('disconnect', () => {
        console.log(`El cliente con id: ${cliente.id} se ha desconectado`);
        usuarioConetados.borrarUsuario( cliente.id )
    });

}

//Escuchar mensajes
export const mensaje = (cliente: Socket, io: socketIO.Server ) => {
    cliente.on('mensaje', ( payload: { de: string, cuerpo: string} ) => {
        console.log('El mensaje recibido es: ', payload);

        io.emit('mensaje-nuevo', payload );

    })
}

export const configUsuario = ( cliente: Socket, io: socketIO.Server ) => {
    cliente.on('configurar-usuario', ( payload: {nombre: string}, callback: Function ) => {

        usuarioConetados.actualizarNombre( cliente.id, payload.nombre );
        callback({
            ok: true,
            mensaje: `Se ha configurado correctamente el usuario ${ payload.nombre } `
        })
    })
}