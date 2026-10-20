let self = {
    gates: {},

    allows(gate, param = null) {
        self.check(gate);
        return self.gates[gate](param);
    },

    denies(gate, param = null) {
        self.check(gate);
        return !self.gates[gate](param);
    },

    any(gates, param = null) {
        for ( let gate of gates ) {
            self.check(gate);
            if ( self.gates[gate](param) ) {
                return true;
            }
        }

        return false;
    },

    none(gates, param = null) {
        for ( let gate of gates ) {
            self.check(gate);
            if ( self.gates[gate](param) ) {
                return false;
            }
        }

        return true;
    },

    define(name, gate) {
        self.gates[name] = gate;
    },

    check(gate) {
        if ( typeof self.gates[gate] !== 'function' ) {
            throw `Gate ${gate} does not exist.`;
        }
    }
}

export default self;
