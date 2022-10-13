const express = require("express")
const fs = require("fs")
const data = require("./clientes.json")
const Client = require('./models/Client')
const path = require ('path')


const app = express()
app.use(express.json())

function writeFile(cb){
    fs.writeFile(
        path.join(__dirname, "clientes.json"),
        JSON.stringify(data, null, 2),
        err => {
            if(err) throw err

            cb(JSON.stringify({message:"ok"}))
        }  
    )
}


app.post("/clienteDB", async (req, res) => {
    //-console.log(req.body);
    
    const client = await Client.create(req.body)

    .then(() => {
        return res.json({
            mensagem: "Usuário cadastrado com sucesso!"
        });
    }).catch(() => {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Usuário não cadastrado com sucesso!"
        });
    });

});

app.get("/clienteDB", async (request, response) => {
    const clients = await Client.findAll();
  
    return response.json({
        clients
    })
});

app.get("/clienteDB/:cpf", async (request, response) => {
    const{cpf} = request.params;
    const client = await Client.findAll({where:{
        cpf: cpf
    }});
  
    return response.json({
        client
    })
});
app.delete("/clienteDB/:cpf", async (request, response) => {
    const{cpf} = request.params;
    const client = await Client.destroy({where:{
        cpf: cpf
    }});
  
    return response.json({
        message:"cliente removido"
    })
});

app.get("/", (request, response) =>{
    return response.json ({
        message: "Home"
    })

})

app.post("/clienteJSON/", (request, response) =>{
    const body = request.body
    const {nome, cpf } = request.body
    data.clientes.push({nome,cpf})
    console.log(body)
    return writeFile((message) => response.end (message))
   
 
})
app.delete("/clienteJSON/:cpf", (request, response) =>{
    const{cpf} = request.params
    data.clientes = data.clientes.filter(item => String(item.cpf) !== String(cpf))
    return writeFile((message) => response.end (message));

})

app.get("/clienteJSON", (request, response) =>{
    const body = request.body
    const {nome, cpf } = request.body
    return response.json(data.clientes)

})

app.get("/clienteJSON/:cpf", (request, response) =>{
    const{cpf} = request.params
    const cliente = data.clientes.find((cliente) => cliente.cpf === cpf)
    console.log(cliente)
    return response.json(cliente)
})

app.put("/clienteJSON/:cpf", (request, response) =>{
    const {cpf} = request.params
    const {nome} = request.body

    const posicaoCliente = data.clientes.findIndex((cliente) => cliente.cpf === cpf)
    console.log(posicaoCliente)
    console.log(data.clientes[posicaoCliente]) 
    data.clientes[posicaoCliente] = {
        ...data.clientes[posicaoCliente],
        nome
    }
    return writeFile((message) => response.end (message))
  
    
})
app.listen(4002, () => console.log('App running in 4002'))