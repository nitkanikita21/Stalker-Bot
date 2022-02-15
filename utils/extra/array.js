module.exports = {
    delete: (arr,value)=>{
        return arr.filter(item => item !== value);
    }
}