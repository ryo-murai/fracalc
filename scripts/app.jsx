

var IntBox = React.createClass({
  propTypes: {
    min: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      min: 0
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
      value={this.state.value} 
      onChange={this.onChangeText}
    />
  }
});

//var Rational = React.createClass({
//  render: function() {
//    return (
//      <div className="row">
//        <div className="col-sm-1">
//          <IntBox />
//        </div>
//        <div className="col-sm-1">
//          <table className="table table-condensed">
//            <tr><td><IntBox /></td></tr>
//            <tr><td><IntBox min={1} /></td></tr>
//          </table>
//        </div>
//      </div>
//    )
//  }
//});


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
    return new Fraction(this.numor * that.numor - that.numor * this.denom, this.denom * that.denom);
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
    var denom = React.findDOMNode(this.refs.denom).value;
    var numor = React.findDOMNode(this.refs.numor).value;
    return new Fraction((num*denom)+numor, denom);
  },
  
  render: function() {
    return (
      <table className="table table-condensed">
        <tr>
          <td className="col-sm-2" rowSpan="2"><IntBox ref="num"/></td>
          <td className="col-sm-2" ><IntBox ref="numor"/></td>
        </tr>
        <tr>
          <td className="col-sm-2" ><IntBox min={1} ref="denom"/></td>
        </tr>
      </table>
    )
  }
});

var Calculator = React.createClass({
  getInitialState: function() {
    return {
      answer: none
    };
  },

  onSubmit: function(e) {
    e.preventDefault();
    var lfrac = this.state.left();
    var rfrac = this.state.right();
    this.setState({ answer: lfrac.plus(rfrac) });
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
          <button >+</button>
        </div>
        <div className="col-md-2">
          <Rational parserCb={this.parserGetter} target={"right"} />
        </div>
        <div className="col-md-1">
          <button type="submit"> = </button>
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
