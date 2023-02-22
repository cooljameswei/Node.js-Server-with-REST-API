const { info } = require('console')
const express = require('express')

const app = express()

app.use(express.json())



let infoDB = [
    {
        id:1,
        title: "Terrible Wonderful Shoes",
        brand: "Adidas",
        category: "shoes",
        sex: "man",
        price: "60$" 
    },
    {
        id:2,
        title: "BS shirt",
        brand: "Nike",
        category: "shirt",
        sex: "woman",
        price: "65$" 
    },
]

const generateId = () => {
    const maxId = infoDB.length > 0
        ? Math.max(...infoDB.map(i => i.id))
        : 0
    
        return maxId + 1
}

const getInfoObjectAndIndex = (id) => {
    //declare our variables
    let infoToModify = {}
    let indexOfInfo = 0
    //find the object through the id and assign our values
    for(let i = 0; i < infoDB.length; i++){
        if(id === infoDB[i].id) {
            infoToModify = infoDB[i]
            indexOfInfo = i
        } 
    }
    //return our values in form of an array
    //so we can use destructuring to assign our variables
    return [infoToModify, indexOfInfo]
}


app.get('/', (req, res) => {
    res.send('hello world')
})

app.get('/api/info', (req, res) =>  {
    res.status(200).json(infoDB)
})

app.get('/api/info/:id', (req, res) => {
    const id = Number(req.params.id)
    const infoObject = infoDB.find(info => info.id == id)
    infoObject
     ? res.status(200).json(infoObject).end()
     : res.status(404).json({
        error: `an object doesn't exist with the id ${id} in our databse`
     }).end()
})

app.post('/api/info', (req, res) => {
    const body = req.body

    if(!body.title)
    {
        return res.status(400).json({
            error: 'you need to type information'
        })
    }

    const infoObject = {
        id: generateId(),
        title: body.title,
        brand: body.brand,
        category: body.category,
        sex: body.sex,
        price: body.price        
    }

    infoDB = infoDB.concat(infoObject)

    res.status(201).json(infoObject)
})

app.delete('/api/info/:id', (req, res) => {
    const id = number(req.params.id);

    infoDB = infoDB.filter(i => i.id !== id)

    res.status(204).end()
})


app.put('/api/info/:id', (req, res) => {
    //get the data from the body
    const body = req.body
    //if we don't get the information for our object throw an error
    if(!body.title) return res.status(400).json({
        error: 'the content is missing'
    })
    //check what you are getting(feel free to add console logs everywhere)
    console.log(body)
    //parse the date into a number
    const id = Number(req.params.id)
    //we use destructuring assignment here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
    const [infoToModify, indexOfInfo] = getInfoObjectAndIndex(id)
    //a console log to show the object we got
    console.log(infoToModify)
    //we make a new object with the new values
    const modifiedInfo = {
        id: infoToModify.id,
        title: body.title,
        brand: body.brand,
        category: body.category,
        sex: body.sex,
        price: body.price
    }
    //insert (or overwrite) our object into the database
    infoDB[indexOfInfo] = modifiedInfo
    //send a success status
    res.status(200).json(modifiedInfo).end()
})

const PORT = 3001

app.listen(PORT, () => {
    console.log(`server running on localhost with port ${PORT}`)
})

