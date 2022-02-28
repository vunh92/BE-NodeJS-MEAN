// Gọi mongoose
const mongoose = require('mongoose');

// Sử dụng mongoose kết nối với mongodb
// mongoose.connect('mongodb+srv://mean12072021:sXgqzcenqi6tKHxt@cluster0.k5bmk.mongodb.net/mean_29_10_2021?retryWrites=true&w=majority')
mongoose.connect('mongodb+srv://huuvu:RTRwSSsHjB17DrBT@cluster0.0c2fs.mongodb.net/mean_29_10_2021?retryWrites=true&w=majority')
.then(()=>console.log('Đã kết nối'))
.catch(()=>console.log('Kết nối thất bại'));