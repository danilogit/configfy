# configfy
We as DevOps engineers sometimes need to deal with a huge varity of config files and its paramenters. Configuring parameters can be very annoying and this module help us to write them more easily using JSON or YAML files structures and [Handlebars](https://handlebarsjs.com/) templates. Actually this is a kind of Handlebars wrapper.

# Installing
    npm i configfy -g

# Usage
    configfy parse -t some-config-file.hbs -d data-file.yml

# Example

Let's suppose we need to edit an HAPROXY config file and add some servers into the backend section. We can write a template `haproxy.hbs` like this 

```
    global
        pidfile /var/run/haproxy.pid
        log 127.0.0.1 local0
        
    defaults
        option httplog
        maxconn 3000
        default-server init-addr last,libc,none

    frontend front-door
        bind *:80
        use_backend my_backend

    backend my_backend
        balance roundrobin
        default-server check maxconn 2000
        {{#each servers}}
        server server-{{@index}} {{address}}:{{port}} init-addr last,libc,none
        {{/each}}
    
    listen stats
        bind *:8404
        stats enable
        stats uri /monitor
```

and use an YAML file `haproxy.yml`to pass our values

```yaml
   servers:
    - address: 10.1.0.5
      port: 8080
    - address: 10.1.0.6
      port: 8080
```

then execute the following command to get our config file

    configfy parse -t haproxy.hbs -d haproxy.yml > haproxy.cfg

