import app from './app';

app.listen(process.env.PORT, () => {
    // eslint-disable-next-line
    console.log(`🚀 Server is running on port ${process.env.PORT}`);
});
