

var IntBox = React.createClass({
  propTypes: {
    min: React.PropTypes.number,
    required: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      min: 0,
      required: false
    };
  },

  getInitialState: function() {
    return {value: ''}
  },

  onChangeText: function(e) {
    this.setState({value: e.target.value});
  },

  render: function() {
    return <input 
      type="number" 
      className="input-sm col-sm-3" 
      min={this.props.min}
      step="1"
      required={this.props.required}
      value={this.state.value} 
      onChange={this.onChangeText}
    />
  }
});

var Fraction = (function() {
  var gcd = function(x, y) {
   if(y==0) {return x;} else {return gcd(y, x % y);}
  };

  var Fraction = function(numerator, denominator) {
    var g = gcd(numerator, denominator);
    this.numor = numerator / g;
    this.denom = denominator / g;
  };

  var p = Fraction.prototype;
  p.plus = function(that) {
    return new Fraction(this.numor * that.denom + that.numor * this.denom, this.denom * that.denom);
  };

  p.minus = function(that) {
    return new Fraction(this.numor * that.denom - that.numor * this.denom, this.denom * that.denom);
  };

  p.mult = function(that) {
    return new Fraction(this.numor * that.numor, this.denom * that.denom);
  };

  p.div = function(that) {
    return new Fraction(this.numor * that.denom, this.denom * that.numor);
  };

  var print = function(f) {
    var num = Math.floor(f.numor / f.denom);
    if(num > 0) {
      return num + " ( " + print(new Fraction(f.numor % f.denom, f.denom)) + " ) ";
    } else {
      if(f.numor == 0) {
        return "0";
      } else if(f.denom == 1) {
        return "" + f.numor;
      } else {
        return "" + f.numor + " / " + f.denom;
      }
    }
  };

  p.prettyPrint = function() {
    return print(this);
  };

  return Fraction;
})();

var none = {
  prettyPrint: function() {
    return "";
  }
};

var Rational = React.createClass({
  propTypes: {
    target: React.PropTypes.string.isRequired,
    parserCb: React.PropTypes.func
  },

  componentDidMount: function() {
    if(this.props.parserCb) { this.props.parserCb(this.props.target, this.parse); }
  },

  parse: function() {
    var num = React.findDOMNode(this.refs.num).value;
    var denom = parseInt(React.findDOMNode(this.refs.denom).value);
    var numor = parseInt(React.findDOMNode(this.refs.numor).value);
    return new Fraction((num*denom)+numor, denom);
  },
  
  render: function() {
      //<table className="table table-condensed">
    return (
      <table >
        <tr>
          <td className="col-sm-2" rowSpan="2"><IntBox ref="num"/></td>
          <td className="col-sm-2" ><IntBox ref="numor" required={true}/></td>
        </tr>
        <tr>
          <td className="col-sm-2" ><IntBox min={1} ref="denom" required={true}/></td>
        </tr>
      </table>
    )
  }
});

var Operator = React.createClass({
  propTypes: {
    labels: React.PropTypes.object,
    onChanged: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      labels: {
        plus:  "＋",
        minus: "－",
        mult:  "×",
        div:   "÷"
      },
      onChanged: function(ope) {}
    };
  },
  
  getInitialState: function() {
    return {
      operator: "plus"
    };
  },

  getOnSelected: function(ope) {
    var elem = this;
    return function(e) {
      elem.setState({operator: ope});
      elem.props.onChanged(ope);
    };
  },

  render: function() {
    return (
      <div className="btn-group">
        <button type="button" className="btn btn-lg dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
          {this.props.labels[this.state.operator]} <span className="caret"></span>
        </button>
        <ul className="dropdown-menu" role="menu">
          <li><a onClick={this.getOnSelected("plus")} href="#">{this.props.labels["plus"]}</a></li>
          <li><a onClick={this.getOnSelected("minus")} href="#">{this.props.labels["minus"]}</a></li>
          <li><a onClick={this.getOnSelected("mult")} href="#">{this.props.labels["mult"]}</a></li>
          <li><a onClick={this.getOnSelected("div")} href="#">{this.props.labels["div"]}</a></li>
        </ul>
      </div>
    );
  }
});

var Calculator = React.createClass({
  getInitialState: function() {
    return {
      answer: none,
      operator: "plus"
    };
  },

  onOperatorChanged: function(ope) {
    this.setState({operator: ope});
  },

  onSubmit: function(e) {
    e.preventDefault();
    var lfrac = this.state.left();
    var rfrac = this.state.right();
    var result = lfrac[this.state.operator](rfrac);
    this.setState({ answer: result });
  },

  parserGetter: function(key, func) {
    var newState = {};
    newState[key] = func;
    this.setState(newState);
  },

  render: function() {
    return (
    <form 
      className="form"
      onSubmit={this.onSubmit}
    >
      <div className="row">
        <div className="col-md-2">
          <Rational parserCb={this.parserGetter} target={"left"} />
        </div>
        <div className="col-md-1">
          <Operator onChanged={this.onOperatorChanged} />
        </div>
        <div className="col-md-2">
          <Rational parserCb={this.parserGetter} target={"right"} />
        </div>
        <div className="col-md-1">
          <button className="btn btn-lg" type="submit"> = </button>
        </div>
      </div>
      <p className="bg-success">{this.state.answer.prettyPrint()}</p>
    </form>)
  }
});

React.render(
  <Calculator />,
  document.getElementById('application')
);
