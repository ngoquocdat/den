var React = require('react-native');
var {
  StyleSheet,
  Image,
  Text,
  View,
  AsyncStorage,
  TouchableOpacity
} = React;

var _ = require('lodash');

var SaveButton = React.createClass({

  getInitialState() {
    return {
      saved: false
    };
  },

  getDefaultProps() {
    return {
      data: {}
    };
  },
  
  componentDidMount() {
    if (!this.props.data.house || !this.props.data.house.id) return;

    this.STORAGE_KEY = '@den-saved-' + this.props.data.house.id;

    AsyncStorage.getItem(this.STORAGE_KEY)
    .then((value) => {
      if (value !== null) this.setState({ saved: true });
    })
    .catch((error) => console.error('AsyncStorage error: ', error.message))
    .done();
  },

  render() {
    var image = <Image source={require('image!Heart')} style={styles.image} />;

    if (this.state.saved) {
      image = <Image source={require('image!Heart-Selected')} style={styles.image} />;
    }

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.handlePress}>
          {image}
        </TouchableOpacity>
      </View>
    );
  },

  handlePress() {
    if (this.state.saved) this.unsaveHouse();
    else this.saveHouse();
  },

  saveHouse() {
    if (!this.STORAGE_KEY) return;

    this.setState({ saved: true });

    var data = _.extend({dateSaved: Date.now()}, this.props.data);

    AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(data))
    .then(() => console.log('house saved: ', this.STORAGE_KEY))
    .catch((error) => console.error('AsyncStorage error: ', error.message))
    .done();
  },

  unsaveHouse() {
    if (!this.STORAGE_KEY) return;

    this.setState({ saved: false });

    AsyncStorage.removeItem(this.STORAGE_KEY)
    .then(() => console.log('house removed: ', this.STORAGE_KEY))
    .catch((error) => console.error('AsyncStorage error: ', error.message))
    .done();
  }
});

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0)'
  },

  image: {
    width: 29,
    height: 26,
  }
});

module.exports = SaveButton;
