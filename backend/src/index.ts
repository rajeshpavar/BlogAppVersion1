import { Hono } from 'hono'
import { cors } from 'hono/cors'
import UserRoute from "./routes/UserRoutes.js"
import PostRoutes from "./routes/PostRoutes.js"


const app = new Hono()

app.use(cors())


app.route("/api/v1",UserRoute)

app.route("/api/v1",PostRoutes)

export default app
