//Usei o express pra criar e configurar meu servidor
const express = require("express")
const server = express()

const db = require("./db")

// const ideas = [
//   {
//     img: "https://image.flaticon.com/icons/svg/2729/2729007.svg",
//     title: "Cursos de Programação",
//     category: "Estudo",
//     description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, ea!",
//     url: "http://rocketseat.com.br"
//   },

//   {
//     img: "https://image.flaticon.com/icons/svg/2729/2729005.svg",
//     title: "Exercícios",
//     category: "Saúde",
//     description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, ea!",
//     url: "http://rocketseat.com.br"
//   },

//   {
//     img: "https://image.flaticon.com/icons/svg/2729/2729027.svg",
//     title: "Meditação",
//     category: "Mentalidade",
//     description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, ea!",
//     url: "http://rocketseat.com.br"
//   },

//   {
//     img: "https://image.flaticon.com/icons/svg/2729/2729032.svg",
//     title: "Karaokê",
//     category: "Diversão em Família",
//     description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, ea!",
//     url: "http://rocketseat.com.br"
//   }
// ]

//configurar arquivos estáticos
server.use(express.static("public"))

//habilitar uso do require.body
server.use(express.urlencoded({extended: true}))

//configurar o nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("views", {
  express: server,
  noCache: true
})

//criei uma rota /
//e capturo o pedido do cliente para responder
server.get("/", function(require, response){

  db.all(`SELECT * FROM ideas`, function(err, rows){
      if(err) {
        console.log(err)
        return response.send("Erro no banco de dados.")
      }  
      const reversedIdeas = [...rows].reverse()

      let lastIdeas = []
    
      for (let idea of reversedIdeas){
        if (lastIdeas.length < 2){
          lastIdeas.push(idea)
        }
      }
    
      return response.render("index.html", {ideas: lastIdeas})
  })
})

server.get("/ideias", function(require, response){

  db.all(`SELECT * FROM ideas`, function(err, rows){
    if(err) {
      console.log(err)
      return response.send("Erro no banco de dados.")
    }

    const reversedIdeas = [...rows].reverse()
  
    return response.render("ideias.html", {ideas: reversedIdeas})

  })

})

server.post("/", function(require, response){
  //Inserir dados na tabela
  const query = `
  INSERT INTO ideas(
    imagem,
    title,
    category,
    description,
    link
  ) VALUES (?, ?, ?, ?, ?);
  `

  const values = [
    require.body.imagem,
    require.body.title,
    require.body.category,
    require.body.description,
    require.body.link
  ]

  db.run(query, values, function(err){
    if(err) {
      console.log(err)
      return response.send("Erro no banco de dados.")
    }

    return response.redirect("/ideias")
  })
})

//Liguei meu servidor na porta 3000
server.listen(3000)