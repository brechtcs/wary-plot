{ config, pkgs, ... }:

{
  # Setup web hosting
  services.nginx.enable = true;
  services.nginx.virtualHosts."drafts.pamphlets.me" = {
    enableACME = true;
    forceSSL = true;

    locations."/" = {
      root = "/ipfs/QmUhk5ov1PY28doSkHPBQwzHRZ68RZgapBGBTWfF8hgc6s";
      tryFiles = "$uri $uri/index.html $uri.html =404";
    };
  };

  # Open ports
  networking.firewall.allowedTCPPorts = [ 80 443 ];
}
