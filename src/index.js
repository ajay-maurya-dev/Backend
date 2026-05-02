import app from "./app.js";
import connectDB from "./db/index.js";



connectDB()
.then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
    app.on('error', (err) => {
        console.error('Server error:', err);
    });
})
.catch((err) => {console.error('Failed to connect to the database:', err);
    process.exit(1); 
});
