var dataFiles = {
	'dataCursos': 'dataCursos.json',
	'dataCursosIns': 'dataCursosInscritos.json'
};
var user = false;
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const fun = require('./funciones.js');
require('./helpers.js');

const dirData = path.join(__dirname, '../data');
const dirPublico = path.join(__dirname, '../public');
const dirNode_modules = path.join(__dirname , '../node_modules');
const dirPartials = path.join(__dirname , '../partials');
hbs.registerPartials(dirPartials);

app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));
app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));
app.use(express.static(dirPublico));
app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.set('view engine', 'hbs');

/*fabian*/
app.get('/', (req, res) => {
	res.render('Login/login');
});

app.all('/login', (req, res) => {
	if (req.query.bool == 1)
	{
		let buscar = {
			id: req.body.idBuscar
		};
		user = fun.mostrarest(buscar);
		if(user)
		{
			res.render('Registro/index');
		}
		else
		{
			res.render('Login/login');
		}
	}else{
		res.render('Login/login');
	}
});

app.all('/registrarUsuario', (req, res) => {
	if(user)
	{
		if (req.query.save == 1) {
			console.log(req.body);
			let data ={
				id: parseInt(req.body.id),
				nombre: req.body.nombre,
				correo: req.body.correo,
				telefono: parseInt(req.body.telefono),
				tipo: "aspirante"
			};
			fun.crear(data);
		}
		res.render('Registro/index');
	}
	else
	{
		res.render('Login/login');
	}
});
/*fabian*/

app.all('/Coordinador/frmCursos', (request, response) =>{
	if(user)
	{
		if (user.tipo != 'Coordinador') {
			response.render('Login/login');
		}
		else
		{
			let flagFRM = false;
			let accion = '';

			if (request.query.acc) {
				if (request.query.acc == 'crear' || request.query.acc == 'actualizar') {
					flagFRM = true;
					accion = request.query.acc;

				}

				if (accion != '') {
					let curso =	{
						accURL: accion,
						txt_id_curso: '',
						txt_nombre_curso: '',
						lst_modalidad: '',
						txt_intensidad: '',
						txt_valor: '',
						txa_descripcion: '',
						lst_estado: '',
						msj: ''
					}

					if (request.query.acc == 'actualizar') {
						if (request.query.txt_id_curso && request.query.txt_nombre_curso && request.query.lst_modalidad && request.query.txt_intensidad && request.query.txt_valor && request.query.txa_descripcion && request.query.lst_estado) {
							curso =	{
								accURL: accion,
								txt_id_curso: request.query.txt_id_curso,
								txt_nombre_curso: request.query.txt_nombre_curso,
								lst_modalidad: request.query.lst_modalidad,
								txt_intensidad: request.query.txt_intensidad,
								txt_valor: request.query.txt_valor,
								txa_descripcion: request.query.txa_descripcion,
								lst_estado: request.query.lst_estado,
								msj: ''
							}
						}
					}

					if (request.query.save == 1) {
						let rutaData = dirData+'\\'+dataFiles.dataCursos;
						let data = {
							txt_id_curso: request.body.txt_id_curso,
							txt_nombre_curso: request.body.txt_nombre_curso,
							lst_modalidad: request.body.lst_modalidad,
							txt_intensidad: request.body.txt_intensidad,
							txt_valor: request.body.txt_valor,
							txa_descripcion: request.body.txa_descripcion,
							lst_estado: request.body.lst_estado
						};
						if (accion == 'crear') {
							existe = fun.consultarData(rutaData, 'cursosCoordinador', data);

							if (existe) {
								var save = false
							}else{
								var save = fun.guardarData(rutaData, data, 'cursosCoordinador');

							}
						}else if(accion == 'actualizar'){
							var save = fun.actualizarData(rutaData, 'cursosCoordinador', data);
						}

						if (save) {
							response.redirect('/Coordinador/lstCursos');
						}else{
							data.accURL = accion;
							data.msj = 'El id '+data.txt_id_curso+' ya existe.';
							response.render(
								'Coordinador/CrearActualizar/frmCursos',
								data
							);

						}

					}else{
						response.render(
							'Coordinador/CrearActualizar/frmCursos',
							curso
						);
					}
				}
			}

			if (!flagFRM) {
				response.redirect('/Coordinador/lstCursos');
			}
		}

	}
	else
	{
		response.render('Login/login');
	}
});

app.get('/Coordinador/lstCursos', (request, response) => {
	if(user)
	{
		if (user.tipo != 'Coordinador') {
			response.render('Login/login');
		}
		else
		{
			let rutaData = dirData+'\\'+dataFiles.dataCursos;
			response.render(
				'Coordinador/Listar/lstCursos',
				{
					rutaFile: rutaData,
					tipoData: 'cursosCoordinador'
				}
			);
		}

	}
	else
	{
		response.render('Login/login');
	}
});

app.get('/Aspirante/lstCursos', (request, response) => {
	let rutaData = dirData+'\\'+dataFiles.dataCursos;

	// validacíon para saber si esta autenticado

	if(1 == 2){
		response.render(
			'Aspirante/Listar/lstCursos',
			{
				rutaFile: rutaData,
				tipoData: 'cursosNoAspirante'
			}
		);
	}else{
		response.render(
			'Aspirante/Listar/lstCursos',
			{
				rutaFile: rutaData,
				tipoData: 'cursosAspirante'
			}
		);
	}
});

app.get('/Aspirante/lstMisCursos', (request, response) => {
	let rutaData = dirData+'\\'+dataFiles.dataCursosIns;

	// validacíon para saber si esta autenticado
	let estudiante = {
		id: 1
	}

	if (request.query.acc) {
		if (request.query.acc == 'eliminar') {
			accion = request.query.acc;

		}

		if (accion != '') {
			estudiante.id_curso = request.query.txt_id_curso;
			var eliminar = fun.eliminarData(rutaData, 'cursosAspirante', estudiante);

			if (eliminar) {
				response.redirect('/Aspirante/lstMisCursos');
			}
		}
	}

	response.render(
		'Aspirante/Listar/lstMisCursos',
		{
			rutaFile: rutaData,
			tipoData: 'misCursosAspirante',
			dataEstudiante: estudiante
		}
	);
});

app.all('/Aspirante/frmCursos', (request, response) =>{
	let accion = '';

	if (request.query.acc) {
		if (request.query.acc == 'ver' || request.query.acc == 'inscribir') {
			flagFRM = true;
			accion = request.query.acc;

		}

		if (accion != '') {

			if (request.query.txt_id_curso && request.query.txt_nombre_curso && request.query.lst_modalidad && request.query.txt_intensidad && request.query.txt_valor && request.query.txa_descripcion && request.query.lst_estado) {
				curso =	{
					accURL: accion,
					txt_id_curso: request.query.txt_id_curso,
					txt_nombre_curso: request.query.txt_nombre_curso,
					lst_modalidad: request.query.lst_modalidad,
					txt_intensidad: request.query.txt_intensidad,
					txt_valor: request.query.txt_valor,
					txa_descripcion: request.query.txa_descripcion,
					lst_estado: request.query.lst_estado
				}
			}

			if (request.query.save == 1) {
				let rutaData = dirData+'\\'+dataFiles.dataCursosIns;
				let data = {
					txt_id_curso: request.body.txt_id_curso,
					txt_nombre_curso: request.body.txt_nombre_curso,
					lst_modalidad: request.body.lst_modalidad,
					txt_intensidad: request.body.txt_intensidad,
					txt_valor: request.body.txt_valor,
					txa_descripcion: request.body.txa_descripcion,
					lst_estado: request.body.lst_estado,
					id_estudiante: 1 // id estudiante Cambiar
				};
				if (accion == 'inscribir') {
					existe = fun.consultarData(rutaData, 'cursosAspirante', data);

					if (existe) {
						var save = false;
					}else{
						var save = fun.guardarData(rutaData, data, 'cursosAspirante');

					}
				}

				if (save) {
					response.redirect('/Aspirante/lstMisCursos');
				}else{
					data.accURL = accion;
					data.msj = 'El estudiante ya esta inscrito en este curso.';
					response.render(
						'Aspirante/CrearActualizar/frmCursos',
						data
					);

				}

			}else{
				response.render(
					'Aspirante/CrearActualizar/frmCursos',
					curso
				);
			}
		}
	}

});


app.listen(3000);