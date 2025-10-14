{
  description = "Dev environment for monorepo";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.05";
    flake-utils.url = "github:numtide/flake-utils";
  };
  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = import nixpkgs { inherit system; };
      in {
        devShells.default = pkgs.mkShell {
          name = "monorepo-dev";
          packages = with pkgs; [
            nodejs_20 pnpm git docker docker-compose tilt dotnet-sdk_8 direnv
          ];
          shellHook = ''echo "✅ Loaded Nix dev environment" '';
        };
      });
}
