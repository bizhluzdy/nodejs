function createAutoComplete(data){
    return (word) => {
        if (!word){return []}
        const caseDestroyer = new RegExp(`^${word}`, 'i');
        return data.filter((string) => caseDestroyer.test(string))
    }
}
module.exports = { createAutoComplete };
