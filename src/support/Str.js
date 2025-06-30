let self = {
    /*helpers from https://github.com/validatorjs/validator.js*/
    ltrim(str, chars) {
        const pattern = chars ? new RegExp(`^[${chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]+`, 'g') : /^\s+/g;
        return `${str}`.replace(pattern, '');
    },

    rtrim(str, chars) {
        const pattern = chars ? new RegExp(`[${chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]+$`, 'g') : /(\s)+$/g;
        return `${str}`.replace(pattern, '');
    },

    trim(str, chars) {
        return self.rtrim(self.ltrim(`${str}`, chars), chars);
    },
    /*end helpers from https://github.com/validatorjs/validator.js*/

    urlencode(str) {
        return encodeURIComponent(str);
    },

    slug(str) {
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        var from = "àáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
        var to   = "aaaaaeeeeiiiioooouuuunc------";

        for (var i=0, l=from.length ; i<l ; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    },

    dash(str) {
        return str.split('').map((letter, idx) => {
            return letter.toUpperCase() === letter
            ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
            : letter;
        }).join('');
    },

    snake(string) {
        return string
            .replace(/\s+(?=\d)/g, '')
            .replace(/\s+/g, '_')
            .replace(/([a-z])([A-Z])/g, '$1_$2')
            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
            .toLowerCase();
    },

    camel(str) {
        return str.replace(/-/g, ' ').replace(/_/g, ' ').replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,function(s) {
            return s.toUpperCase();
        }).replace(/\s+/g, '');
    },

    pascal(str) {
        return `${str}`
            .toLowerCase()
            .replace(new RegExp(/[-_]+/, 'g'), ' ')
            .replace(new RegExp(/[^\w\s]/, 'g'), '')
            .replace(new RegExp(/\s+(.)(\w*)/, 'g'), ($1, $2, $3) => `${$2.toUpperCase() + $3}`)
            .replace(new RegExp(/\w/), s => s.toUpperCase());
    },

    kebab(str) {
        return `${str}`.replace(/([a-z])([A-Z])/g, "$1-$2")
            .replace(/[\s_]+/g, '-')
            .toLowerCase();
    },

    camel2space(str) {
        if ( !str ) {
            return '';
        }

        return str.split('').map((letter, idx) => {
            return letter.toUpperCase() === letter
            ? `${idx !== 0 ? ' ' : ''}${letter}`
            : letter;
        }).join('');
    },

    ucfirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    ucwords(str) {
        if ( !str ) {
            str = '';
        }

        //ensure string
        str = str + '';

        return str.replace(/-/g, ' ').replace(/_/g, ' ').replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,function(s) {
            return s.toUpperCase();
        });
    },

    ordinal_suffix(i) {
        var j = i % 10,
            k = i % 100;
        if (j == 1 && k != 11) {
            return i + "st";
        }
        if (j == 2 && k != 12) {
            return i + "nd";
        }
        if (j == 3 && k != 13) {
            return i + "rd";
        }

        return i + "th";
    },

    number_to_month(number) {
        let months = {
            1: 'January',
            2: 'February',
            3: 'March',
            4: 'April',
            5: 'May',
            6: 'June',
            7: 'July',
            8: 'August',
            9: 'September',
            10: 'October',
            11: 'November',
            12: 'December',
        };

        return months[`${number}`.replace(/^0/, '')];
    },

    nl2br(str) {
        if ( !str || !str.length ) {
            return '';
        }

        return str.replace(/(\r\n|\n\r|\r|\n)/g, '<br/>' + '$1');
    },

    strip_tags(str) {
        var div = document.createElement("div");
        div.innerHTML = str;
        var text = div.textContent || div.innerText || "";
        return text;
    },

    ensure_https(string) {
        if (!string.match(/^[a-zA-Z]+:\/\//)) {
            string = 'https://' + string;
        }

        return string;
    },

    add_commas(number) {
        if ( number === undefined || number === null ) {
            return '';
        }

        number = parseFloat(number).toFixed(2).toLocaleString('en-US');

        return number;
    },

    leading_zero(number) {
        return number < 10 ? `0${number}` : number;
    },

    to_percetange(number) {
        if ( number === undefined || !number ) {
            return '0%';
        }

        return (number / 10)+'%';
    },

    plural(str) {
        if ( str.match(/y$/) ) {
            return str.replace(/y$/, 'ies');
        }

        if ( str.match(/s$/) ) {
            return `${str}es`;
        }

        return `${str}s`;
    },

    truncate(str, length) {
        if (str.length > length) {
            return str.slice(0, length) + '...';
        }

        return str;
    },

    string_to_date(str) {
        let match;
        let months_short = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

        //trim spaces
        str = str.trim();

        //dash format: 23-10-2024
        match = str.match(/(\d{2})-(\d{2})-(\d{4})/);
        if ( match && match.length == 4 ) {
            return new Date(`${match[3]}-${match[2]}-${match[1]}`);
        }

        //dot format: 23.10.2024
        match = str.match(/(\d{2})\.(\d{2})\.(\d{4})/);
        if ( match && match.length == 4 ) {
            return new Date(`${match[3]}-${match[2]}-${match[1]}`);
        }

        //pretty format: 23 Oct
        match = str.match(/(\d{2}) (\w{3})/i);
        if ( match && match.length == 3 ) {
            let date = new Date();
            let month = months_short.indexOf(match[2].toLowerCase()) + 1;
            return new Date(`${date.getFullYear()}-${self.leading_zero(month)}-${match[1]}`);
        }

        //pretty format with year: 23 Oct 2024
        match = str.match(/(\d{2}) (\w{3}) (\d{4})/i);
        if ( match && match.length == 4 ) {
            let month = months_short.indexOf(months_short[match[2].toLowerCase()]) + 1;
            return new Date(`${match[3]}-${self.leading_zero(month)}-${match[1]}`);
        }

        //today
        if ( str.match(/^today$/i) ) {
            return new Date();
        }

        //yesterday
        if ( str.match(/^yesterday$/i) ) {
            let date = new Date();
            return date.setDate(date.getDate() - 1);
        }

        return new Date(str);
    },

    pretty_date(date) {
        if ( !date ) {
            return 'Never';
        }

        let mysql_date = date;
        if ( typeof date == 'string' ) {
            date = new Date(date);
        }
        else {
            mysql_date = self.mysql_date(date);
        }

        if ( isNaN(date) ) {
            return 'Invalid Date';
        }

        //check if is today
        let today = new Date();
        if ( self.mysql_date(today) == mysql_date ) {
            return 'Today';
        }

        //check if is yesterday
        today.setDate(today.getDate() - 1);
        if ( self.mysql_date(today) == mysql_date ) {
            return 'Yesterday';
        }

        //check if is current year then don't display it
        if ( new Date(date).getFullYear() == new Date().getFullYear() ) {
            return `${self.leading_zero(date.getDate())} ${date.toLocaleString('default', { month: 'short' })}`;
        }

        return `${self.leading_zero(date.getDate())} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    },

    pretty_datetime(date) {
        const options = {};
        const parsed_date = new Date(new Date(date + 'Z').toLocaleString('en-US', options)); // Add 'Z' for UTC handling
        const now = new Date();

        if (parsed_date.getFullYear() === now.getFullYear()) {
            return parsed_date.toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            }).replace(',', ' @');
        }

        return parsed_date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }).replace(',', ' @');
    },

    pretty_time(date) {
        const options = {};
        const parsed_date = new Date(new Date(date + 'Z').toLocaleString('en-US', options)); // Add 'Z' for UTC handling

        return parsed_date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    },

    mysql_date(date = null) {
        if ( !date ) {
            date = new Date();
        }

        let month = date.getMonth() + 1;
        let day = date.getDate();
        return `${date.getFullYear()}-${self.leading_zero(month)}-${self.leading_zero(day)}`;
    },

    mask(str) {
        if ( !str.length ) {
            return;
        }

        let visible_chars_left = 0;
        let visible_chars_right = 0;

        if ( str.length > 6 ) {
            visible_chars_left = 2;
        }

        if ( str.length > 10 ) {
            visible_chars_right = 2;
        }
        if ( str.length > 20 ) {
            visible_chars_left = 3;
            visible_chars_left = 3;
        }

        let bullet_count = str.length - visible_chars_left - visible_chars_right;
        if ( bullet_count < 0 ) {
            bullet_count = str.length;
        }

        if ( bullet_count > 10 ) {
            bullet_count = 10;
        }

        return str.substring(0, visible_chars_left) + '⁕'.repeat(bullet_count) + str.substring(str.length - visible_chars_right);
    },
}

export default self;
