use borsh::{BorshDeserialize, BorshSerialize};
use nifty_asset_types::{
    extensions::ExtensionType,
    state::{DelegateRole, Standard},
};
use shank::{ShankContext, ShankInstruction};

#[derive(BorshDeserialize, BorshSerialize, Clone, Debug, ShankContext, ShankInstruction)]
#[rustfmt::skip]
pub enum Instruction {
    /// Closes an uninitialized asset (buffer) account.
    /// 
    /// You can only close the buffer account if it has not been used to create an asset.
    #[account(0, signer, writable, name="buffer", desc = "The unitialized buffer account")]
    #[account(1, writable, name="destination", desc = "The account receiving refunded rent")]
    Close,

    /// Burns an asset.
    #[account(0, writable, name="asset", desc = "Asset account")]
    #[account(1, signer, writable, name="signer", desc = "The holder or burn delegate of the asset")]
    #[account(2, optional, writable, name="recipient", desc = "The account receiving refunded rent")]
    Burn,

    /// Creates a new asset.
    #[account(0, signer, writable, name="asset", desc = "Asset account")]
    #[account(1, name="authority", desc = "The authority of the asset")]
    #[account(2, name="holder", desc = "The holder of the asset")]
    #[account(3, optional, signer, writable, name="payer", desc = "The account paying for the storage fees")]
    #[account(4, optional, name="system_program", desc = "The system program")]
    Create(Metadata),

    /// Approves a delegate to manage an asset.
    #[account(0, writable, name="asset", desc = "Asset account")]
    #[account(1, signer, name="holder", desc = "The holder of the asset")]
    #[account(2, name="delegate", desc = "The delegate account")]
    Delegate(Vec<DelegateRole>),

    /// Allocates an extension into an uninitialized asset (buffer) account.
    #[account(0, signer, writable, name="asset", desc = "Asset account")]
    #[account(1, optional, signer, writable, name="payer", desc = "The account paying for the storage fees")]
    #[account(2, optional, name="system_program", desc = "The system program")]
    Allocate(Extension),

    /// Locks an asset.
    #[account(0, writable, name="asset", desc = "Asset account")]
    #[account(1, signer, name="authority", desc = "Delegate or holder account")]
    Lock,

    /// Transfers ownership of the aseet to a new public key.
    #[account(0, writable, name="asset", desc = "Asset account")]
    #[account(1, signer, name="signer", desc = "Current holder of the asset or transfer delegate")]
    #[account(2, name="recipient", desc = "The recipient of the asset")]
    Transfer,

    /// Unlocks an asset.
    #[account(0, writable, name="asset", desc = "Asset account")]
    #[account(1, signer, name="authority", desc = "Delegate ot holder account")]
    Unlock,

    /// Updates an asset.
    #[account(0, writable, name="asset", desc = "Asset account")]
    #[account(1, signer, name="authority", desc = "The authority of the asset")]
    #[account(2, optional, writable, name="buffer", desc = "Extension (asset) buffer account")]
    #[account(3, optional, signer, writable, name="payer", desc = "The account paying for the storage fees")]
    #[account(4, optional, name="system_program", desc = "The system program")]
    Update(UpdateData),

    /// Writes data to an extension.
    #[account(0, signer, writable, name="asset", desc = "Asset account")]
    #[account(1, signer, writable, name="payer", desc = "The account paying for the storage fees")]
    #[account(2, name="system_program", desc = "The system program")]
    Write(Data),
}

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct Metadata {
    /// Name of the asset.
    pub name: String,

    /// Indicates the standard of an asset.
    pub standard: Standard,

    /// Indicates whether the asset is mutable or not.
    pub mutable: bool,
}

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct Extension {
    /// Extension type to initialize.
    pub extension_type: ExtensionType,

    /// Total length of the extension data.
    pub length: u32,

    /// Extension data.
    pub data: Option<Vec<u8>>,
}

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct Data {
    /// Indicates whether to overwrite the buffer or not.
    pub overwrite: bool,

    /// Extension data.
    pub bytes: Vec<u8>,
}

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct UpdateData {
    /// The updated name of the asset.
    pub name: Option<String>,

    /// Updates whether the asset is mutable or not.
    ///
    /// Once an asset is immutable, it cannot be made mutable.
    pub mutable: Option<bool>,

    /// Extension to be updated.
    pub extension: Option<Extension>,
}
