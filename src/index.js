const { request } = require('express');
const express = require('express');
const { uuid } = require('uuidv4');

const app = express();
app.use(express.json()); //Configura o express para aceitar requisições do tipo JSON

//http://localhost:3333/projects?title=node&owner=Flavio

const projects = [];

//Middleware
function logRoutes(request, response, next){
    const { method, url } = request;

    const route = `[${method.toUpperCase()}] ${url}`;

    console.log(route);
    return next();
}

//app.use(logRoutes); //Desta forma o Middleware será utilizado para todas as rotas da aplicação.

app.get('/projects', logRoutes, (request, response) => {
    //Select
    const { title } = request.query;
    const results = title ? projects.filter(p => p.title.includes(title)) : projects;

    return response.json(results);
});

app.post('/projects', (request, response) => {
    //Create
    const { title, owner } = request.body;
    
    const id = uuid();
    const project = {
        id,
        title,
        owner
    };
    projects.push(project)
    return response.json(project);
});

app.put('/projects/:id', (request, response) => {
    //Update
    const { id }= request.params; //id para identificar o dado que deve ser modificado
    const { title, owner } = request.body; //Body com as informações a serem modificadas.
    const projectIndex = projects.findIndex(p => p.id === id);

    if(projectIndex < 0) { //Caso o indice seja negativo, não encontrou o que o cliente informou.
        return response.status(400).json({ erro: 'Project not found.'});
    }

    const project = {
        id,
        title,
        owner
    };

    projects[projectIndex] = project;
    return response.json(project);
});

app.delete('/projects/:id', (request, response) => {
    //Delete
    const { id } = request.params;
    const projectIndex = projects.findIndex(p => p.id === id);

    if(projectIndex < 0) { //Caso o indice seja negativo, não encontrou o que o cliente informou.
        return response.status(400).json({ erro: 'Project not found.'});
    }

    projects.splice(projectIndex, 1); //Apara um item do array
    return response.status(204).json([]);
});

app.listen(3333, () => {
    console.log('Backend started! ')
});