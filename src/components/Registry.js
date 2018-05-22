import { contract } from './utils';
import Component from './Component';
import Account from './Account';
import Parameterizer from './Parameterizer';
import Listing from './Listing';
import Challenge from './Challenge';

class Registry extends Component {
  constructor(address, provider) {
    super(provider);

    this.address = address;
    this.contract = contract('Registry', address, provider);
  }

  async createListing(hash, amount, data, _sendObj = {}) {
    await this.send(this.contract.methods.apply, hash, amount, data, _sendObj);

    return new Listing(hash, this);
  }

  getListing(hash) {
    return new Listing(hash, this);
  }

  getChallenge(id) {
    return new Challenge(id, this);
  }

  hasListing(hash) {
    return this.getListing(hash).exists();
  }

  async getAccount(owner) {
    let tokenAddress = await this.contract.methods.token().call();

    return new Account(owner, tokenAddress, this.provider);
  }

  async getParameterizer() {
    let parameterizerAddress = await this.contract.methods.parameterizer().call();

    return new Parameterizer(parameterizerAddress, this.provider);
  }

  async getName() {
    try {
      let name = await this.contract.methods.name().call();

      return name;
    } catch (err) {
      console.log(err);
    }
    return 'no name available';
  }
}

export default Registry;
