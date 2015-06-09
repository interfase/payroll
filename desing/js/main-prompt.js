(function($){
    //para settear event handlers de selection en los grids del prompt
    var setGridEventHandlers = function(grid){
        var gridElement = $(grid.container).find('.Grid').first(),
            index = null;

        $(grid.columns).each(function(i,c){
           //busca en las columnas del grid la que tenga clickEvent o link
           if(c.gxControl.clickEvent || c.gxControl.link){
               index = c.index;
               return false;
           }
        });

        if(index!=null){
            gridElement.find('tbody td[colindex="'
                            + index
                            + '"] .ReadonlyAttribute a').each(function(){
                var self = this,
                    $this = $(self),
                    tr = $this.closest('tr');

                //settea el evento click de la tr
                $this.click(function(ev){
                    ev.stopPropagation();
                });
                tr.click(function(ev){
                    self.click();
                    ev.stopPropagation();
                })
            })
        }
    }

    $(document).ready(function(){

        setTimeout(function(){
            gx.fx.obs.addObserver("grid.onafterrender", this, function (grid) {
                setGridEventHandlers(grid);
                console.log('Grid updated event handlers');
            });

            $(gx.pO.Grids).each(function () {
                setGridEventHandlers(this.grid);
            })
        }, 20);

    });
})(jQuery);