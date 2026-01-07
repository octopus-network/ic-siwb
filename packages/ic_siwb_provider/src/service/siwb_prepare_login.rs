use ic_cdk::update;
use ic_siwb::utils::{get_script_from_address, AddressInfo};
use ic_siwb::with_settings;

// Prepare the login by generating a challenge (the SIWB message) and returning it to the caller.
#[update]
fn siwb_prepare_login(address: String) -> Result<String, String> {
    // Create an BtcAddress from the string. This validates the address.
    let AddressInfo {
        address_raw,
        network: address_network,
        ..
    } = get_script_from_address(address)?;

    // Check if the address network matches the configured network in settings
    let configured_network = with_settings!(|settings: &ic_siwb::settings::Settings| {
        settings.network
    });
    
    if address_network != configured_network {
        return Err(format!(
            "Address network mismatch: address is {:?} but settings network is {:?}",
            address_network, configured_network
        ));
    }

    match ic_siwb::login::prepare_login(&address_raw) {
        Ok(m) => Ok(m.into()),   // Converts SiwbMessage to String
        Err(e) => Err(e.into()), // Converts BtcError to String
    }
}
