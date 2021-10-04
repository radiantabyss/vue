import * as ValidatorJS from 'validatorjs';

const Validator = {
    make(data, rules, messages) {
        //format messages
        let formatted_messages = {};
        for ( let key in messages ) {
            let split = key.split('.');
            let pop = split.pop();
            formatted_messages[`${split[split.length - 1]}.${pop.join('.')}`] = messages[key];
        }

        let validator = new ValidatorJS(data, rules, formatted_messages);

        return {
            passes() {
                return validator.passes();
            },
            messages() {
                return validator.errors.all();
            },
        };
    }
}

export default Validator;
