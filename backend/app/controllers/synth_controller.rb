class SynthController < ApplicationController
  layout false

  def index
    send_file Rails.public_path.join("index.html"), type: "text/html", disposition: "inline"
  end
end
