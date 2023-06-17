let self = {
    gates: {},

    allows(gate, param = null) {
        return self.gates[gate](param);
    },

    denies(gate, param = null) {
        return !self.gates[gate](param);
    },

    any(gates, param = null) {
        for ( let gate of gates ) {
            if ( self.gates[gate](param) ) {
                return true;
            }
        }

        return false;
    },

    none(gates, param = null) {
        for ( let gate of gates ) {
            if ( self.gates[gate](param) ) {
                return false;
            }
        }

        return true;
    },

    define(name, gate) {
        self.gates[name] = gate;
    },
}

export default self;
