{
  description = "Dev environment for HeimdallVaults";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.05";
    nixpkgs-unstable.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, nixpkgs-unstable, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        pkgsUnstable = import nixpkgs-unstable { inherit system; };
      in {
        devShells.default = pkgs.mkShell {
          name = "heimdallvaults-dev";

          # Use Node 20 from unstable (which currently tracks 20.19.4)
          packages = with pkgs; [
            pkgsUnstable.nodejs_20
            git
            docker
            docker-compose
            tilt
            dotnet-sdk_8
            direnv
            pnpm
          ];

          shellHook = ''
            echo "✅ Nix dev env loaded"
            node -v
            pnpm -v
          '';
        };
      });
}