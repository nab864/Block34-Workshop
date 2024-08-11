const express = require("express")
const app = express()
const { client, createTable, createCustomer, fetchCustomer, createRestaurant, fetchRestaurant, createReservation, fetchReservation, destroyReservation } = require("./db")
const port = process.env.PORT || 3000


app.use(express.json())
app.use(require("morgan")("dev"))

app.get("/api/customers", async (req, res, next) => {
  try {
    res.send(await fetchCustomer())
  } catch (error) {
    next(error)
  }
})

app.get("/api/restaurants", async (req, res, next) => {
  try {
    res.send(await fetchRestaurant())
  } catch (error) {
    next(error)
  }
})

app.get("/api/reservations", async (req, res, next) => {
  try {
    res.send(await fetchReservation())
  } catch (error) {
    next(error)
  }
})

app.post("/api/customers/:id/reservations", async (req, res, next) => {
  try {
    const customer_id = req.params.id
    const { date, party_count, restaurant_id} = req.body
    // res.send(await createReservation(date, party_count, restaurant_id, customer_id))
    res.status(201).send(await createReservation(date, party_count, restaurant_id, customer_id))
  } catch (error) {
    next(error)
  }
})

app.delete("/api/customers/:customer_id/reservations/:id", async (req, res, next) => {
  try {
    const id  = req.params.id
    await destroyReservation(id)
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})




const init = async () => {
  await client.connect()

  console.log("connected to client")

  await createTable()

  await createCustomer("Kai")
  await createRestaurant("Taco Bell")
  const customer = await fetchCustomer()
  const restaurant = await fetchRestaurant()
  await createReservation("2022-04-13", 3, restaurant[0].id, customer[0].id)
  console.log(customer)

  app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })
}

init()
