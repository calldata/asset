//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use borsh::BorshDeserialize;
use borsh::BorshSerialize;

/// Accounts.
pub struct Burn {
    /// Asset account
    pub asset: solana_program::pubkey::Pubkey,
    /// The holder or burn delegate of the asset
    pub signer: solana_program::pubkey::Pubkey,
    /// The account receiving refunded rent
    pub recipient: Option<solana_program::pubkey::Pubkey>,
    /// Asset account of the group
    pub group: Option<solana_program::pubkey::Pubkey>,
}

impl Burn {
    pub fn instruction(&self) -> solana_program::instruction::Instruction {
        self.instruction_with_remaining_accounts(&[])
    }
    #[allow(clippy::vec_init_then_push)]
    pub fn instruction_with_remaining_accounts(
        &self,
        remaining_accounts: &[solana_program::instruction::AccountMeta],
    ) -> solana_program::instruction::Instruction {
        let mut accounts = Vec::with_capacity(4 + remaining_accounts.len());
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.asset, false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.signer,
            true,
        ));
        if let Some(recipient) = self.recipient {
            accounts.push(solana_program::instruction::AccountMeta::new(
                recipient, false,
            ));
        } else {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                crate::ASSET_ID,
                false,
            ));
        }
        if let Some(group) = self.group {
            accounts.push(solana_program::instruction::AccountMeta::new(group, false));
        } else {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                crate::ASSET_ID,
                false,
            ));
        }
        accounts.extend_from_slice(remaining_accounts);
        let data = BurnInstructionData::new().try_to_vec().unwrap();

        solana_program::instruction::Instruction {
            program_id: crate::ASSET_ID,
            accounts,
            data,
        }
    }
}

#[derive(BorshDeserialize, BorshSerialize)]
struct BurnInstructionData {
    discriminator: u8,
}

impl BurnInstructionData {
    fn new() -> Self {
        Self { discriminator: 1 }
    }
}

/// Instruction builder for `Burn`.
///
/// ### Accounts:
///
///   0. `[writable]` asset
///   1. `[writable, signer]` signer
///   2. `[writable, optional]` recipient
///   3. `[writable, optional]` group
#[derive(Default)]
pub struct BurnBuilder {
    asset: Option<solana_program::pubkey::Pubkey>,
    signer: Option<solana_program::pubkey::Pubkey>,
    recipient: Option<solana_program::pubkey::Pubkey>,
    group: Option<solana_program::pubkey::Pubkey>,
    __remaining_accounts: Vec<solana_program::instruction::AccountMeta>,
}

impl BurnBuilder {
    pub fn new() -> Self {
        Self::default()
    }
    /// Asset account
    #[inline(always)]
    pub fn asset(&mut self, asset: solana_program::pubkey::Pubkey) -> &mut Self {
        self.asset = Some(asset);
        self
    }
    /// The holder or burn delegate of the asset
    #[inline(always)]
    pub fn signer(&mut self, signer: solana_program::pubkey::Pubkey) -> &mut Self {
        self.signer = Some(signer);
        self
    }
    /// `[optional account]`
    /// The account receiving refunded rent
    #[inline(always)]
    pub fn recipient(&mut self, recipient: Option<solana_program::pubkey::Pubkey>) -> &mut Self {
        self.recipient = recipient;
        self
    }
    /// `[optional account]`
    /// Asset account of the group
    #[inline(always)]
    pub fn group(&mut self, group: Option<solana_program::pubkey::Pubkey>) -> &mut Self {
        self.group = group;
        self
    }
    /// Add an aditional account to the instruction.
    #[inline(always)]
    pub fn add_remaining_account(
        &mut self,
        account: solana_program::instruction::AccountMeta,
    ) -> &mut Self {
        self.__remaining_accounts.push(account);
        self
    }
    /// Add additional accounts to the instruction.
    #[inline(always)]
    pub fn add_remaining_accounts(
        &mut self,
        accounts: &[solana_program::instruction::AccountMeta],
    ) -> &mut Self {
        self.__remaining_accounts.extend_from_slice(accounts);
        self
    }
    #[allow(clippy::clone_on_copy)]
    pub fn instruction(&self) -> solana_program::instruction::Instruction {
        let accounts = Burn {
            asset: self.asset.expect("asset is not set"),
            signer: self.signer.expect("signer is not set"),
            recipient: self.recipient,
            group: self.group,
        };

        accounts.instruction_with_remaining_accounts(&self.__remaining_accounts)
    }
}

/// `burn` CPI accounts.
pub struct BurnCpiAccounts<'a, 'b> {
    /// Asset account
    pub asset: &'b solana_program::account_info::AccountInfo<'a>,
    /// The holder or burn delegate of the asset
    pub signer: &'b solana_program::account_info::AccountInfo<'a>,
    /// The account receiving refunded rent
    pub recipient: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    /// Asset account of the group
    pub group: Option<&'b solana_program::account_info::AccountInfo<'a>>,
}

/// `burn` CPI instruction.
pub struct BurnCpi<'a, 'b> {
    /// The program to invoke.
    pub __program: &'b solana_program::account_info::AccountInfo<'a>,
    /// Asset account
    pub asset: &'b solana_program::account_info::AccountInfo<'a>,
    /// The holder or burn delegate of the asset
    pub signer: &'b solana_program::account_info::AccountInfo<'a>,
    /// The account receiving refunded rent
    pub recipient: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    /// Asset account of the group
    pub group: Option<&'b solana_program::account_info::AccountInfo<'a>>,
}

impl<'a, 'b> BurnCpi<'a, 'b> {
    pub fn new(
        program: &'b solana_program::account_info::AccountInfo<'a>,
        accounts: BurnCpiAccounts<'a, 'b>,
    ) -> Self {
        Self {
            __program: program,
            asset: accounts.asset,
            signer: accounts.signer,
            recipient: accounts.recipient,
            group: accounts.group,
        }
    }
    #[inline(always)]
    pub fn invoke(&self) -> solana_program::entrypoint::ProgramResult {
        self.invoke_signed_with_remaining_accounts(&[], &[])
    }
    #[inline(always)]
    pub fn invoke_with_remaining_accounts(
        &self,
        remaining_accounts: &[(
            &'b solana_program::account_info::AccountInfo<'a>,
            bool,
            bool,
        )],
    ) -> solana_program::entrypoint::ProgramResult {
        self.invoke_signed_with_remaining_accounts(&[], remaining_accounts)
    }
    #[inline(always)]
    pub fn invoke_signed(
        &self,
        signers_seeds: &[&[&[u8]]],
    ) -> solana_program::entrypoint::ProgramResult {
        self.invoke_signed_with_remaining_accounts(signers_seeds, &[])
    }
    #[allow(clippy::clone_on_copy)]
    #[allow(clippy::vec_init_then_push)]
    pub fn invoke_signed_with_remaining_accounts(
        &self,
        signers_seeds: &[&[&[u8]]],
        remaining_accounts: &[(
            &'b solana_program::account_info::AccountInfo<'a>,
            bool,
            bool,
        )],
    ) -> solana_program::entrypoint::ProgramResult {
        let mut accounts = Vec::with_capacity(4 + remaining_accounts.len());
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.asset.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.signer.key,
            true,
        ));
        if let Some(recipient) = self.recipient {
            accounts.push(solana_program::instruction::AccountMeta::new(
                *recipient.key,
                false,
            ));
        } else {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                crate::ASSET_ID,
                false,
            ));
        }
        if let Some(group) = self.group {
            accounts.push(solana_program::instruction::AccountMeta::new(
                *group.key, false,
            ));
        } else {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                crate::ASSET_ID,
                false,
            ));
        }
        remaining_accounts.iter().for_each(|remaining_account| {
            accounts.push(solana_program::instruction::AccountMeta {
                pubkey: *remaining_account.0.key,
                is_signer: remaining_account.1,
                is_writable: remaining_account.2,
            })
        });
        let data = BurnInstructionData::new().try_to_vec().unwrap();

        let instruction = solana_program::instruction::Instruction {
            program_id: crate::ASSET_ID,
            accounts,
            data,
        };
        let mut account_infos = Vec::with_capacity(4 + 1 + remaining_accounts.len());
        account_infos.push(self.__program.clone());
        account_infos.push(self.asset.clone());
        account_infos.push(self.signer.clone());
        if let Some(recipient) = self.recipient {
            account_infos.push(recipient.clone());
        }
        if let Some(group) = self.group {
            account_infos.push(group.clone());
        }
        remaining_accounts
            .iter()
            .for_each(|remaining_account| account_infos.push(remaining_account.0.clone()));

        if signers_seeds.is_empty() {
            solana_program::program::invoke(&instruction, &account_infos)
        } else {
            solana_program::program::invoke_signed(&instruction, &account_infos, signers_seeds)
        }
    }
}

/// Instruction builder for `Burn` via CPI.
///
/// ### Accounts:
///
///   0. `[writable]` asset
///   1. `[writable, signer]` signer
///   2. `[writable, optional]` recipient
///   3. `[writable, optional]` group
pub struct BurnCpiBuilder<'a, 'b> {
    instruction: Box<BurnCpiBuilderInstruction<'a, 'b>>,
}

impl<'a, 'b> BurnCpiBuilder<'a, 'b> {
    pub fn new(program: &'b solana_program::account_info::AccountInfo<'a>) -> Self {
        let instruction = Box::new(BurnCpiBuilderInstruction {
            __program: program,
            asset: None,
            signer: None,
            recipient: None,
            group: None,
            __remaining_accounts: Vec::new(),
        });
        Self { instruction }
    }
    /// Asset account
    #[inline(always)]
    pub fn asset(&mut self, asset: &'b solana_program::account_info::AccountInfo<'a>) -> &mut Self {
        self.instruction.asset = Some(asset);
        self
    }
    /// The holder or burn delegate of the asset
    #[inline(always)]
    pub fn signer(
        &mut self,
        signer: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.signer = Some(signer);
        self
    }
    /// `[optional account]`
    /// The account receiving refunded rent
    #[inline(always)]
    pub fn recipient(
        &mut self,
        recipient: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    ) -> &mut Self {
        self.instruction.recipient = recipient;
        self
    }
    /// `[optional account]`
    /// Asset account of the group
    #[inline(always)]
    pub fn group(
        &mut self,
        group: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    ) -> &mut Self {
        self.instruction.group = group;
        self
    }
    /// Add an additional account to the instruction.
    #[inline(always)]
    pub fn add_remaining_account(
        &mut self,
        account: &'b solana_program::account_info::AccountInfo<'a>,
        is_writable: bool,
        is_signer: bool,
    ) -> &mut Self {
        self.instruction
            .__remaining_accounts
            .push((account, is_writable, is_signer));
        self
    }
    /// Add additional accounts to the instruction.
    ///
    /// Each account is represented by a tuple of the `AccountInfo`, a `bool` indicating whether the account is writable or not,
    /// and a `bool` indicating whether the account is a signer or not.
    #[inline(always)]
    pub fn add_remaining_accounts(
        &mut self,
        accounts: &[(
            &'b solana_program::account_info::AccountInfo<'a>,
            bool,
            bool,
        )],
    ) -> &mut Self {
        self.instruction
            .__remaining_accounts
            .extend_from_slice(accounts);
        self
    }
    #[inline(always)]
    pub fn invoke(&self) -> solana_program::entrypoint::ProgramResult {
        self.invoke_signed(&[])
    }
    #[allow(clippy::clone_on_copy)]
    #[allow(clippy::vec_init_then_push)]
    pub fn invoke_signed(
        &self,
        signers_seeds: &[&[&[u8]]],
    ) -> solana_program::entrypoint::ProgramResult {
        let instruction = BurnCpi {
            __program: self.instruction.__program,

            asset: self.instruction.asset.expect("asset is not set"),

            signer: self.instruction.signer.expect("signer is not set"),

            recipient: self.instruction.recipient,

            group: self.instruction.group,
        };
        instruction.invoke_signed_with_remaining_accounts(
            signers_seeds,
            &self.instruction.__remaining_accounts,
        )
    }
}

struct BurnCpiBuilderInstruction<'a, 'b> {
    __program: &'b solana_program::account_info::AccountInfo<'a>,
    asset: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    signer: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    recipient: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    group: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    /// Additional instruction accounts `(AccountInfo, is_writable, is_signer)`.
    __remaining_accounts: Vec<(
        &'b solana_program::account_info::AccountInfo<'a>,
        bool,
        bool,
    )>,
}
