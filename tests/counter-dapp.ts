import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CounterDapp } from "../target/types/counter_dapp";
import { assert } from "chai";

describe("counter-dapp", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.CounterDapp as Program<CounterDapp>;
  const counter = anchor.web3.Keypair.generate();

  it("initializes the counter", async () => {
    await program.methods.initialize().accounts({
      counter: counter.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    }).signers([counter]).rpc();

    const account = await program.account.counter.fetch(counter.publicKey);
    assert.strictEqual(account.count.toNumber(), 0);
  });

  it("increments the counter", async () => {
    await program.methods.increment().accounts({
      counter: counter.publicKey,
    }).rpc();

    const account = await program.account.counter.fetch(counter.publicKey);
    assert.strictEqual(account.count.toNumber(), 1);
  });

  it("decrements the counter", async () => {
    await program.methods.decrement().accounts({
      counter: counter.publicKey,
    }).rpc();

    const account = await program.account.counter.fetch(counter.publicKey);
    assert.strictEqual(account.count.toNumber(), 0);
  });
});
