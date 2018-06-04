const url = require('url');
const sitemaps = require('sitemap-stream-parser');

var domains = [];

exports.getAllURLs = function(req, res){
  // Okay... First, it's assumed that site is defined somehow.
  var url;
  if(req.body.site){
    url = parseUrl(req.body.site);
  }else if(req.query && req.query.site){
    url = parseUrl(req.query.site);
  }else{
    return res.status( 420 ).send( 'Missing required \'site\' parameter.' );
  }

  // Now that we have url...
  sitemaps.parseSitemaps(url.protocol + '//' + url.host + '/sitemap.xml', addURL, function(err, sitemaps){
    if(err){
      res.status(500).send('We are unable to process your request right now.');
    }else{
      res.status(200).send({
        sitemaps: sitemaps,
        domains: domains
      });
    }
  });

  // res.status( 201 ).send();
}

function addURL(url){
  if( ! domains.includes(url) ){
    domains.push(url);
  }
}

function parseUrl(site){
  // First, validate that site is at minimum a domain.
  var urlToParse = url.parse(site);

  // If host isn't defined, check path.
  if(!urlToParse.host){
    // It's distinctly possible that we were merely missing http...
    if(site.indexOf('http') == -1){
      // Found it. Try again.
      return parseUrl('http://' + site);
    }
    // Otherwise... hm. That's not good
  }

  return urlToParse;
}
