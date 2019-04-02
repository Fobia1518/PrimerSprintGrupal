const fs = require('fs');
var dataCursos = [];
var dataMisCursos = [];

/*fabian*/
const path = require('path');
const pathdata =  path.join(__dirname, '../data');
listaEstudiantes = [];
/*fabian*/

var guardarData = (rutaFile, data, tipoData) => {
	if (tipoData == 'cursosCoordinador') {
		if (data) {
			dataCursos.push(data);
		}
		data = dataCursos;
	}
	if (tipoData == 'cursosAspirante') {
		if (data) {
			dataMisCursos.push(data);
		}
		data = dataMisCursos;
	}

	var save = true;
	fs.writeFile(rutaFile, JSON.stringify(data), (err) => {
		if (err){
			save = false;
			throw err;
		}

	});

	return save;
}

var consultarData = (rutaFile, tipoData, buscar = false) => {
	let data = {};

	if (fs.existsSync(rutaFile)) {
		if (tipoData == 'cursosCoordinador') {
			data = dataCursos = require(rutaFile);
		}else if(tipoData == 'cursosAspirante'){
			data = dataMisCursos = require(rutaFile);

		}
	}

	if (buscar) {
		if (tipoData == 'cursosCoordinador') {
			data = dataCursos.find(buscarCurso => buscarCurso.txt_id_curso == buscar.txt_id_curso);
		}

		if (tipoData == 'cursosAspirante') {
			data = dataMisCursos.find(buscarCurso => (buscarCurso.txt_id_curso == buscar.txt_id_curso && buscarCurso.id_estudiante == buscar.id_estudiante));
		}

	}

	return data;
}

var actualizarData = (rutaFile, tipoData, buscar = false) => {
	let editar = consultarData(rutaFile, tipoData, buscar);
	if (tipoData == 'cursosCoordinador') {
		editar.txt_nombre_curso = buscar.txt_nombre_curso;
		editar.lst_modalidad = buscar.lst_modalidad;
		editar.txt_intensidad = buscar.txt_intensidad;
		editar.txt_valor = buscar.txt_valor;
		editar.txa_descripcion = buscar.txa_descripcion;
		editar.lst_estado = buscar.lst_estado;
	}
	return guardarData(rutaFile, false, tipoData);

}

/*fabian*/
const crear = (estudiante) => {
	listar();
	let est = {
		id: estudiante.id,
		nombre: estudiante.nombre,
		correo: estudiante.correo,
		telefono: estudiante.telefono,
		tipo: "aspirante"
	};
	let duplicado = listaEstudiantes.find(varest => varest.id == estudiante.id)
	if (!duplicado){
		listaEstudiantes.push(est);
		console.log(listaEstudiantes);
		guardar('creado');
	}
	else
	{
		window.alert('Ya existe un estudiante con el mismo id');
	}
};

const listar = () => {
	try
	{
		listaEstudiantes = require('../data/listado.json'); //data
	}
	catch (error)
	{
		listaEstudiantes = [];
	}
}

const guardar = (men) => {
	let datos = JSON.stringify(listaEstudiantes);
	fs.writeFile(pathdata + '/listado.json', datos, (error)=>{
		if (error) throw (error);
			console.log('Estudiante ' + men + ' con exito');
	});
}

const mostrar = () => {
	listar();
	console.log('Estudiantes inscritos\n')
	listaEstudiantes.forEach(estudiante => {
		console.log('Estudiante')
		console.log('	ID: ' + estudiante.id)
		console.log('	Nombre: ' + estudiante.nombre)
		console.log('	Correo: ' + estudiante.correo)
		console.log('	Telefono: ' + estudiante.telefono)
		console.log('	Tipo: ' + estudiante.tipo + '\n')
	})
}

const mostrarest = (varid) => {
	listar();

	return listaEstudiantes.find(buscar => buscar.id == varid.id);

}

const actualizar = (estudiante) => {
	listar();
	let est = listaEstudiantes.find(buscar => buscar.id == estudiante.id);
	if (!est){
		console.log('No existe este estudiante');
	}
	else
	{
		est.nombre = estudiante.nombre;
		est.correo = estudiante.correo;
		est.telefono = estudiante.telefono;
		guardar('actualizado');
	}
}

const eliminar = (varid) => {
	listar();
	let eliminarest = listaEstudiantes.filter(eliminar => eliminar.id != varid);
	if (varid.length == listaEstudiantes.length){
		console.log('No existe este estudiante');
	}
	else
	{
		let est = listaEstudiantes.find(buscar => buscar.id == varid);
		if (est)
		{
			listaEstudiantes = eliminarest;
			guardar('eliminado');
		}
		else
		{
			console.log('No existe este estudiante');
		}
	}
}
/*fabian*/
var eliminarData = (rutaFile, tipoData, buscar = false) => {
	console.log('buscar');
	console.log(buscar);
	consultarData(rutaFile, tipoData);
	if (tipoData == 'cursosAspirante') {
		let eliminarMisCursos = dataMisCursos.filter(eliminar => (eliminar.txt_id_curso != buscar.id_curso || eliminar.id_estudiante != buscar.id));
		let est = dataMisCursos.find(eliminar => (eliminar.txt_id_curso == buscar.id_curso && eliminar.id_estudiante == buscar.id));
		if (est)
		{
			dataMisCursos = eliminarMisCursos;
		}

	}
	return guardarData(rutaFile, false, tipoData);
}

module.exports = {
	guardarData,
	consultarData,
	actualizarData,
	crear,
	mostrar,
	mostrarest,
	actualizar,
	eliminar,
  eliminarData
};