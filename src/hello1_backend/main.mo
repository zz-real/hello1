import List "mo:base/List";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Time "mo:base/Time";

actor {

    public type Message = {
        text :Text;
        author : Text;
        time :Time.Time;
    };

    stable var followed :List.List<Principal> = List.nil();

    stable var messages :List.List<Message> = List.nil();

    private stable var auth: Text = "zz";

    public type Microblog = actor {
        follow: shared(Principal)  -> async (); //添加关注对象
        follows: shared query ()  -> async [Principal]; //返回关注对象列表
        reset_follow: shared() -> async ();
        post: shared (Text,Text)  -> async (); //发布新消息
        posts: shared query (Time.Time)  -> async [Message]; //返回所有发布的消息
        timeline: shared (Time.Time)  -> async [Message]; //返回所有关注对象发布的消息
        set_name: shared (Text) -> async ();
        get_name: shared () -> async ?Text;
    };

    public shared func set_name(t: Text) : async () {
        auth := t;
    };

    public shared func get_name() : async ?Text {
        ?auth
    };


    public shared func follow (id :Principal) :async(){
        followed := List.push(id, followed);
    };

    public shared func follows () :async [Principal]{
        List.toArray(followed);
    };

    public shared func reset_follow() : async () {
        followed := List.nil();
    };

    public shared (caller) func post (otp: Text, text :Text) :async (){
        assert(otp == "123456");

        var msg : Message = {
            text = text;
            time = Time.now();
            author = auth;
        };

        messages := List.push(msg, messages);
    };
    
    public shared query func posts(since : Time.Time) :async [Message]{
        var since_message : List.List<Message> = List.nil();
            for (msg in Iter.fromList(messages)) {
                if (msg.time >= since) {
                    since_message := List.push(msg, since_message);
                };
            };
        return List.toArray(since_message);
    };

    public shared func timeline(since : Time.Time) : async [Message]{
        var all :List.List<Message> = List.nil();

        for (id in Iter.fromList(followed)){
            let canister :Microblog = actor(Principal.toText(id));
            let msgs = await canister.posts(since);
            for(msg in Iter.fromArray(msgs)){
                all := List.push(msg, all);
            };
        };

        List.toArray(all);
    };
};
