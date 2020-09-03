const TaskModel = require('../model/TaskModel');
const { response } = require('express');
const {
       startOfDay, 
       endOfDay, 
       startOfWeek, 
       endOfWeek, 
       startOfMonth, 
       endOfMonth,
       startOfYear,
       endOfYear
    } = require('date-fns');

const current = new Date();

class TaskController {

    // sempre que utilizar uma funcao que depende de acesso ao banco 
    // de dados é necessário incluir o comando async
    async create(req,res){
        // recebe as informacoes pelo corpo da requisicao
        const task = new TaskModel(req.body);    
        await task
            // sava no mongo se tudo der certo
            .save()            
            .then(response => {
                return res.status(200).json(response);
            })
            .catch(error => {
                return res.status(500).json(error);
            });
    }

    async update(req,res){
       await TaskModel.findByIdAndUpdate({ '_id' : req.params.id }, req.body, {new : true})
       .then(response => {
           return res.status(200).json(response);
       })
       .catch(error => {
           return res.status(500).json(error);
       });
    }

    async all(req,res){
        await TaskModel.find({ macaddress: {'$in' : req.params.macaddress} })
        .sort('when')
        .then(response => {
            return res.status(200).json(response);
        })
        .catch(error => {
            return res.status(500).json(error);
        });
    }

    async show(req, res){
        await TaskModel.findById(req.params.id)
        .then(response => {
          if(response)
            return res.status(200).json(response);
          else
            return res.status(404).json({error: 'tarefa não encontrada'});
        })
        .catch(error => {
          return res.status(500).json(error);
        });
    }    

    async delete(req, res){
        await TaskModel.deleteOne({'_id': req.params.id})
        .then(response => {
            return res.status(200).json(response);
        })
        .catch(error => {
            return res.status(500).json(error);
        });
    }

    async done(req, res){
        await TaskModel.findByIdAndUpdate(
            {'_id' : req.params.id},
            {'done': req.params.done},
            {new: true})
            .then(response => {
                return res.status(200).json(response);
            })
            .catch(error => {
                return res.status(500).json(error);
            });
    }


    //********** Inicio Filtros ************/

    async late(req, res){
        await TaskModel.find(
            // "$lt" operador "menor que"
            {
            'when'       : {'$lt': current},
            'macaddress' : {'$in': req.params.macaddress}
            })
            .sort('when')
            .then(response => {
                return res.status(200).json(response);
            })
            .catch(error => {
                return res.status(500).json(error);
            });
    }

    async today(req, res){
        await TaskModel.find(
            // "$gte" operador "maior ou igual"
            // "$lte" operador "menor ou igual que"
            {
            'macaddress' : {'$in': req.params.macaddress},
            'when'       : {'$gte': startOfDay(current), '$lte' : endOfDay(current)}          
            })
            .sort('when')
            .then(response => {
                return res.status(200).json(response);
            })
            .catch(error => {
                return res.status(500).json(error);
            });
    }

    async week(req, res){
        await TaskModel.find(
            // "$gte" operador "maior ou igual"
            // "$lte" operador "menor ou igual que"
            {
            'macaddress' : {'$in': req.params.macaddress},
            'when'       : {'$gte': startOfWeek(current), '$lte' : endOfWeek(current)}          
            })
            .sort('when')
            .then(response => {
                return res.status(200).json(response);
            })
            .catch(error => {
                return res.status(500).json(error);
            });
    }   
    
    async month(req, res){
        await TaskModel.find(
            // "$gte" operador "maior ou igual"
            // "$lte" operador "menor ou igual que"
            {
            'macaddress' : {'$in': req.params.macaddress},
            'when'       : {'$gte': startOfMonth(current), '$lte' : endOfMonth(current)}          
            })
            .sort('when')
            .then(response => {
                return res.status(200).json(response);
            })
            .catch(error => {
                return res.status(500).json(error);
            });
    }    

    async year(req, res){
        await TaskModel.find(
            // "$gte" operador "maior ou igual"
            // "$lte" operador "menor ou igual que"
            {
            'macaddress' : {'$in': req.params.macaddress},
            'when'       : {'$gte': startOfYear(current), '$lte' : endOfYear(current)}          
            })
            .sort('when')
            .then(response => {
                return res.status(200).json(response);
            })
            .catch(error => {
                return res.status(500).json(error);
            });
    }       
    //********** Fim Filtros ************/
}

module.exports = new TaskController();