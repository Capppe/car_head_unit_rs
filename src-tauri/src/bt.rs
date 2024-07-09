use bt_wrapper::bluetooth::Bluetooth;

async fn get_bluetooth_status() -> Result<String, String> {
    let bt = Bluetooth::new().await?;

    Ok("".to_string())
}
