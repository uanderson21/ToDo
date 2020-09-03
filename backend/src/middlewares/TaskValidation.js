const TaskModel = require('../model/TaskModel');

// isPast é uma função que verifica se a data é inferior a data atual
const { isPast } = require('date-fns')

const TaskValidation = async (req,res,next) => {

    const { macaddress, type, title, description, when } = req.body;

    if (!macaddress){
        return res.status(400).json({ error: 'Macaddress é obrigatório'});
    }else if (!type){
        return res.status(400).json({ error: 'Tipo é obrigatório'});
    }else if (!title){
        return res.status(400).json({ error: 'Título é obrigatório'});
    }else if (!description){
        return res.status(400).json({ error: 'Descrição é obrigatória'});        
    }else if (!when){
        return res.status(400).json({ error: 'Data é hora são obrigatórios'});    
    }else if (isPast(new Date(when))){
        return res.status(400).json({ error: 'Escolha uma data e hora futura'});                       
    }else{
       // "let" -> variavel 
       let exists;

       // procura no banco se já existe uma tarefa cadastrada no mesmo dia e horario.
       if(req.params.id){
        exists = await TaskModel.
                      findOne(
                        {
                         // "$ne" operador de negacao, ou seja, equivalente ao "<>"  
                          '_id': { '$ne': req.params.id },
                          // "$eq" é um operador equivalente a "="
                          'when': {'$eq': new Date(when) },  
                          // "$in" se está contido, se existe
                          'macaddress': {'$in': macaddress}
                        });
      }else{
        if(isPast(new Date(when)))
          return res.status(400).json({ error: 'escolha uma data e hora futura'});
        exists = await TaskModel.
          findOne(
            { 
              // "$eq" é um operador equivalente a "="
              'when': {'$eq': new Date(when)},  
              // "$in" se está contido, se existe
              'macaddress': {'$in': macaddress}
            });
      }       
      if (exists){
          return res.status(400).json({ error: 'Já existe uma tarefa nesse dia e horario'});  
      }else{
          next();
      }          
    }

} 

module.exports = TaskValidation;